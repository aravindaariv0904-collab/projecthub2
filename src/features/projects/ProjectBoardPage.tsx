import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { supabase } from '../../lib/supabase';
import { Project, RequiredSkill, SuggestedRole } from '../../types';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Bookmark, 
  Users, 
  Clock, 
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const ProjectBoardPage: React.FC = () => {
  const { currentUser, bookmarks, toggleBookmarkProject } = useApp();
  
  // Real project state from Supabase
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  
  // Create project state
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'College Project',
    difficulty: 'Intermediate',
    techStack: '',
    requiredSkills: '',
    teamSize: '3',
    deadline: '',
    problemSolved: '',
    targetUsers: ''
  });

  // Project details & application state
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyingRole, setApplyingRole] = useState<any | null>(null);
  const [pitch, setPitch] = useState('');
  const [contributeSkills, setContributeSkills] = useState('');

  // Toast State
  const [toastMsg, setToastMsg] = useState('');

  // Fetch projects from Supabase
  const loadProjects = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // Fetch projects along with nested relationships and creator profiles
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:creator_id(id, name, avatar_url, college, course),
          project_technologies(name, category, why),
          project_required_skills(name, priority),
          project_suggested_roles(name, skills, priority, count, filled),
          project_members(student_id, role, status)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setProjectsList(data || []);
    } catch (err: any) {
      console.error('Error fetching projects from Supabase:', err);
      setErrorMsg('Unable to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (!currentUser) return null;

  // Filter projects logic
  const filteredProjects = projectsList.filter(project => {
    // Search query check
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = project.name.toLowerCase().includes(query);
      const matchDesc = project.description.toLowerCase().includes(query);
      const matchCreator = project.profiles?.name?.toLowerCase().includes(query);
      const matchTech = project.project_technologies?.some((t: any) => t.name.toLowerCase().includes(query));
      if (!matchName && !matchDesc && !matchCreator && !matchTech) return false;
    }

    // Category pill filter mapping
    if (categoryFilter !== 'All') {
      // Maps filter string to DB enum value
      const categoryMap: { [key: string]: string } = {
        'Hackathons': 'Hackathon',
        'Startups': 'Startup',
        'Open Source': 'Open Source',
        'College Projects': 'College Project',
        'Research': 'Research'
      };
      const expectedCategory = categoryMap[categoryFilter] || categoryFilter;
      if (project.category !== expectedCategory) return false;
    }

    // Difficulty dropdown filter
    if (difficultyFilter !== 'All' && project.difficulty !== difficultyFilter) return false;

    return true;
  });

  // Sort projects logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === 'Newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortOrder === 'Deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (sortOrder === 'Team Size') {
      return b.team_size - a.team_size;
    }
    return 0;
  });

  // Post Project Handler
  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.teamSize) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    try {
      setPostLoading(true);

      // 1. Insert projects record
      const { data: projectData, error: projectErr } = await supabase
        .from('projects')
        .insert({
          name: formData.title.trim(),
          description: formData.description.trim(),
          problem_solved: formData.problemSolved.trim() || null,
          target_users: formData.targetUsers.trim() || null,
          category: formData.category,
          difficulty: formData.difficulty,
          team_size: parseInt(formData.teamSize) || 3,
          creator_id: currentUser.id,
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
          status: 'Planning'
        })
        .select()
        .single();

      if (projectErr || !projectData) {
        throw projectErr || new Error('Failed to create project.');
      }

      const projectId = projectData.id;

      // 2. Insert Tech Stack
      if (formData.techStack.trim()) {
        const techs = formData.techStack.split(',').map(t => ({
          project_id: projectId,
          name: t.trim(),
          category: 'Frontend/Backend'
        })).filter(t => t.name.length > 0);

        if (techs.length > 0) {
          await supabase.from('project_technologies').insert(techs);
        }
      }

      // 3. Insert Required Skills
      if (formData.requiredSkills.trim()) {
        const skills = formData.requiredSkills.split(',').map(s => ({
          project_id: projectId,
          name: s.trim(),
          priority: 'Required' as const
        })).filter(s => s.name.length > 0);

        if (skills.length > 0) {
          await supabase.from('project_required_skills').insert(skills);
        }
      }

      // 4. Insert Default Suggested Roles matching required skills
      const roleName = formData.category === 'Startup' ? 'Co-founder' : 'Contributor';
      const roleSkills = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      await supabase.from('project_suggested_roles').insert({
        project_id: projectId,
        name: roleName,
        skills: roleSkills,
        priority: 'High',
        count: parseInt(formData.teamSize) - 1,
        filled: 0
      });

      // 5. Insert Creator as Joined Team Member
      await supabase.from('project_members').insert({
        project_id: projectId,
        student_id: currentUser.id,
        role: 'Project Lead',
        status: 'Joined'
      });

      setToastMsg('Project posted successfully!');
      setPostModalOpen(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'College Project',
        difficulty: 'Intermediate',
        techStack: '',
        requiredSkills: '',
        teamSize: '3',
        deadline: '',
        problemSolved: '',
        targetUsers: ''
      });

      // Re-load list from Supabase
      loadProjects();
    } catch (err: any) {
      console.error('Error creating project:', err);
      setErrorMsg(err.message || 'An unexpected error occurred while saving the project.');
    } finally {
      setPostLoading(false);
    }
  };

  // Direct Join Project Handler
  const handleJoinProject = async (project: any) => {
    if (!currentUser) return;
    setErrorMsg('');

    if (project.creator_id === currentUser.id) {
      setToastMsg('You cannot join your own project.');
      return;
    }

    const isMember = project.project_members?.some((m: any) => m.student_id === currentUser.id);
    if (isMember) {
      setToastMsg('You are already a member or pending approval.');
      return;
    }

    // Verify slots
    const totalMembers = project.project_members?.filter((m: any) => m.status === 'Joined').length || 0;
    if (totalMembers >= project.team_size) {
      setToastMsg('Team is currently full.');
      return;
    }

    try {
      // Insert student into members table with Pending status (allowed by RLS)
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: project.id,
          student_id: currentUser.id,
          role: 'Contributor',
          status: 'Pending'
        });

      if (error) throw error;

      setToastMsg('Join request submitted successfully!');
      loadProjects(); // Reload list
    } catch (err: any) {
      console.error('Error joining project:', err);
      setToastMsg(err.message || 'Unable to join project. Please try again.');
    }
  };

  // Open Apply Modal
  const handleApplyRole = (role: SuggestedRole) => {
    setApplyingRole(role);
    setPitch(currentUser?.bio || '');
    setContributeSkills(currentUser?.skills.map(s => s.name).join(', ') || '');
    setApplyModalOpen(true);
  };

  // Submit Project Role Application
  const handleSubmitApplication = async () => {
    if (!selectedProject || !applyingRole) return;

    try {
      const { error } = await supabase
        .from('project_applications')
        .insert({
          project_id: selectedProject.id,
          student_id: currentUser.id,
          role_name: applyingRole.name,
          pitch: pitch.trim(),
          skills: contributeSkills.trim(),
          status: 'Pending'
        });

      if (error) throw error;

      setToastMsg(`Application to join as ${applyingRole.name} submitted successfully.`);
      setApplyModalOpen(false);
      setSelectedProject(null);
      loadProjects();
    } catch (err: any) {
      console.error('Error applying for role:', err);
      setToastMsg(err.message || 'Application failed. You might have already applied for this role.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Project Board</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Discover student projects and request to join complementary teams.
          </p>
        </div>
        <Button 
          variant="primary" 
          size="md" 
          onClick={() => setPostModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
          className="font-bold shadow-premium shrink-0"
        >
          Post Project
        </Button>
      </div>

      {/* Filter and Search Actions */}
      <Card padded className="bg-white border border-slate-100 shadow-premium">
        <div className="flex flex-col gap-4">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 border-b border-slate-50 pb-3">
            {['All', 'College Projects', 'Hackathons', 'Startups', 'Open Source', 'Research'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative flex items-center">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects by title, stack, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>

            {/* Difficulty Dropdown */}
            <div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:border-primary-500 focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Sort Order Dropdown */}
            <div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:border-primary-500 focus:outline-none"
              >
                <option value="Newest">Sort: Newest First</option>
                <option value="Deadline">Sort: Deadline</option>
                <option value="Team Size">Sort: Team Size</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Projects Grid Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3" />
          <span className="text-xs font-semibold">Loading projects from database...</span>
        </div>
      ) : sortedProjects.length === 0 ? (
        <Card padded className="text-center py-16 text-slate-400 bg-white">
          <Briefcase className="h-10 w-10 mx-auto text-slate-350 mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or filters, or be the first to post a new project on the board!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => {
            const isBookmarked = bookmarks.projectIds.includes(project.id);
            const activeMembersCount = project.project_members?.filter((m: any) => m.status === 'Joined').length || 0;
            const slotsLeft = Math.max(0, project.team_size - activeMembersCount);
            
            return (
              <Card key={project.id} hoverable className="flex flex-col justify-between bg-white border border-slate-100">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wider">
                      {project.category}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <Badge variant={project.difficulty === 'Advanced' ? 'danger' : 'primary'} size="sm">
                        {project.difficulty}
                      </Badge>
                      <button 
                        onClick={() => toggleBookmarkProject(project.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isBookmarked 
                            ? 'bg-amber-50 border-amber-200 text-amber-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-1">{project.name}</h3>
                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-4">{project.description}</p>

                  {/* Skills required tags */}
                  {project.project_required_skills && project.project_required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.project_required_skills.slice(0, 3).map((skill: any, idx: number) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          {skill.name}
                        </span>
                      ))}
                      {project.project_required_skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5">
                          +{project.project_required_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-50 pt-4 flex flex-col space-y-3">
                  {/* Creator and Slots Row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      {project.profiles?.avatar_url ? (
                        <img 
                          src={project.profiles.avatar_url} 
                          alt={project.profiles.name} 
                          className="w-6 h-6 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px]">
                          {project.profiles?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                      <span className="text-slate-600 font-medium truncate max-w-[100px]">By {project.profiles?.name || 'Student'}</span>
                    </div>
                    <span className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                      slotsLeft > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {slotsLeft > 0 ? `${slotsLeft} Slots Left` : 'Team Full'}
                    </span>
                  </div>

                  {/* Deadline row */}
                  {project.deadline && (
                    <div className="flex items-center text-[10px] text-slate-400 space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedProject(project)}
                      className="font-bold text-xs"
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      disabled={project.creator_id === currentUser.id || slotsLeft === 0}
                      onClick={() => handleJoinProject(project)}
                      className="font-bold text-xs"
                    >
                      {project.creator_id === currentUser.id ? 'My Project' : 'Join / Apply'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Post Project Modal Form */}
      {postModalOpen && (
        <Modal 
          isOpen={postModalOpen} 
          onClose={() => setPostModalOpen(false)}
          title="Post a New Project"
          size="md"
        >
          <form onSubmit={handlePostProject} className="space-y-4">
            {errorMsg && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 rounded-lg font-medium border border-red-150">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Title *</label>
              <Input
                type="text"
                placeholder="e.g. EcoSphere: Carbon Footprint Tracker"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Description *</label>
              <textarea
                placeholder="What is your project about? Explain the goals and what you want to construct."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="College Project">College Project</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Startup">Startup</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Difficulty *</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tech Stack (comma separated)</label>
              <Input
                type="text"
                placeholder="e.g. React, TypeScript, FastAPI, PostgreSQL"
                value={formData.techStack}
                onChange={(e) => setFormData({...formData, techStack: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Required Skills (comma separated)</label>
              <Input
                type="text"
                placeholder="e.g. Python backend, UI design, Database mapping"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Team Size Limit</label>
                <Input
                  type="number"
                  placeholder="3"
                  min="2"
                  max="10"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deadline</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setPostModalOpen(false)}
                className="w-full font-bold"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                isLoading={postLoading}
                className="w-full font-bold"
              >
                Submit Project
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.name}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wider">Description</span>
              <p className="text-slate-600 text-xs leading-relaxed mt-1">{selectedProject.description}</p>
            </div>

            {selectedProject.problem_solved && (
              <div>
                <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wider">Problem Statement</span>
                <p className="text-slate-600 text-xs leading-relaxed mt-1">{selectedProject.problem_solved}</p>
              </div>
            )}

            {selectedProject.target_users && (
              <div>
                <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wider">Target Users</span>
                <p className="text-slate-600 text-xs leading-relaxed mt-1">{selectedProject.target_users}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Category</span>
                <span className="text-xs font-semibold text-slate-800">{selectedProject.category}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Difficulty</span>
                <span className="text-xs font-semibold text-slate-800">{selectedProject.difficulty}</span>
              </div>
            </div>

            {/* Technologies stack items */}
            {selectedProject.project_technologies && selectedProject.project_technologies.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.project_technologies.map((t: any, idx: number) => (
                    <span key={idx} className="text-[10px] bg-primary-50 text-primary-600 border border-primary-100 px-2 py-0.5 rounded font-semibold">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Required Skills stack items */}
            {selectedProject.project_required_skills && selectedProject.project_required_skills.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">Required Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.project_required_skills.map((s: any, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Roles list */}
            {selectedProject.project_suggested_roles && selectedProject.project_suggested_roles.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Available Roles</span>
                <div className="space-y-2">
                  {selectedProject.project_suggested_roles.map((role: any, idx: number) => {
                    const isRoleFilled = role.filled >= role.count;
                    return (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{role.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Skills: {role.skills?.join(', ') || 'Any'}</span>
                        </div>
                        <Button
                          variant={isRoleFilled ? "ghost" : "primary"}
                          size="sm"
                          disabled={isRoleFilled || selectedProject.creator_id === currentUser.id}
                          onClick={() => handleApplyRole(role)}
                          className="font-bold tracking-wide"
                        >
                          {isRoleFilled ? 'Filled' : 'Apply'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active team members list */}
            {selectedProject.project_members && selectedProject.project_members.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Active Team Members</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProject.project_members
                    .filter((m: any) => m.status === 'Joined')
                    .map((m: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2 bg-slate-50 border border-slate-100/50 p-2 rounded-lg text-xs font-semibold text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[9px]">
                          {m.student_id === currentUser.id ? 'Me' : 'U'}
                        </div>
                        <span className="truncate">{m.role}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-50">
              <Button 
                variant="outline" 
                onClick={() => setSelectedProject(null)}
                className="w-full font-bold"
              >
                Close Details
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Role Application Pitch Form Modal */}
      {applyModalOpen && applyingRole && (
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title={`Apply as ${applyingRole.name}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pitch Statement</label>
              <textarea
                placeholder="Explain why you are a good fit for this role and what you can contribute."
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Relevant Skills</label>
              <Input
                type="text"
                placeholder="e.g. React, Docker, Python backend"
                value={contributeSkills}
                onChange={(e) => setContributeSkills(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setApplyModalOpen(false)}
                className="w-full font-bold"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitApplication}
                className="w-full font-bold"
              >
                Submit Pitch
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Active Toast Alerts */}
      {toastMsg && (
        <Toast 
          message={toastMsg} 
          onClose={() => setToastMsg('')} 
        />
      )}

    </div>
  );
};

export default ProjectBoardPage;
