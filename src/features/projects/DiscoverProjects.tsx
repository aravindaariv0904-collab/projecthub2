import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  HelpCircle, 
  Bookmark, 
  ExternalLink, 
  Clock, 
  Users, 
  FileCode2, 
  ArrowRight,
  Info,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';
import { Project, Student, RequiredSkill, SuggestedRole } from '../../types';

export const DiscoverProjects: React.FC = () => {
  const { 
    currentUser, 
    projects, 
    students, 
    bookmarks, 
    toggleBookmarkProject, 
    applyForProjectRole,
    updateProject,
    toggleBookmarkIdea
  } = useApp();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');

  // Discovery Mode: 'browse' or 'idea-generator'
  const [mode, setMode] = useState<'browse' | 'generator'>('browse');

  // Project detail modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyingRole, setApplyingRole] = useState<SuggestedRole | null>(null);
  const [pitch, setPitch] = useState('');
  const [contributeSkills, setContributeSkills] = useState('');

  // Idea Generator quiz state
  const [quizSkills, setQuizSkills] = useState('');
  const [quizInterests, setQuizInterests] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('Intermediate');
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState('');

  if (!currentUser) return null;

  // Filter projects list
  const filteredProjects = projects.filter(project => {
    // Hide own projects from discovery browse
    const isMine = project.creatorId === currentUser.id;
    if (isMine) return false;

    // Category check
    if (categoryFilter !== 'All' && project.category !== categoryFilter) return false;

    // Difficulty check
    if (difficultyFilter !== 'All' && project.difficulty !== difficultyFilter) return false;

    // Tech check
    if (techFilter !== 'All' && !project.technologies.some(t => t.name.toLowerCase() === techFilter.toLowerCase())) return false;

    // Search query check
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = project.name.toLowerCase().includes(query);
      const matchDesc = project.description.toLowerCase().includes(query);
      const matchTech = project.technologies.some(t => t.name.toLowerCase().includes(query));
      return matchName || matchDesc || matchTech;
    }

    return true;
  });

  // Calculate Match Score
  const calculateMatchScore = (project: Project) => {
    const userSkills = currentUser.skills.map(s => s.name.toLowerCase());
    const projectSkills = project.requiredSkills.map(s => s.name.toLowerCase());
    const matchingSkills = currentUser.skills.filter(s => projectSkills.includes(s.name.toLowerCase()));
    
    // Base overlap score
    const skillScore = matchingSkills.length * 12;
    const overlapInterest = currentUser.interests.some(i => project.description.toLowerCase().includes(i.toLowerCase()));

    const score = 65 + skillScore + (overlapInterest ? 10 : 0);
    return {
      percent: Math.min(98, Math.max(50, score)),
      matching: matchingSkills.map(s => s.name)
    };
  };

  const handleApplyRole = (role: SuggestedRole) => {
    setApplyingRole(role);
    setPitch(currentUser?.bio || '');
    setContributeSkills(currentUser?.skills.map(s => s.name).join(', ') || '');
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = () => {
    if (!selectedProject || !applyingRole) return;
    
    applyForProjectRole(selectedProject.id, applyingRole.name, pitch, contributeSkills);
    setToastMsg(`Application to join as ${applyingRole.name} submitted successfully.`);
    setApplyModalOpen(false);
    setSelectedProject(null);
  };

  const handleDirectJoin = () => {
    if (!currentUser || !selectedProject) return;

    // Find first vacant role
    const vacantRole = selectedProject.suggestedRoles.find(r => r.filled < r.count);
    if (!vacantRole) {
      setToastMsg("No vacant roles available for direct join!");
      return;
    }

    const updatedMembers = [...selectedProject.members, { studentId: currentUser.id, role: vacantRole.name, status: 'Joined' as const }];
    const updatedRoles = selectedProject.suggestedRoles.map(r => 
      r.name === vacantRole.name ? { ...r, filled: r.filled + 1 } : r
    );

    updateProject({
      ...selectedProject,
      members: updatedMembers,
      suggestedRoles: updatedRoles,
      status: selectedProject.status === 'Planning' ? 'Active' : selectedProject.status
    });

    setToastMsg(`Joined team successfully as ${vacantRole.name}!`);
    setSelectedProject(null); // Close modal
  };

  // Idea Generator trigger
  const handleGenerateIdeas = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizLoading(true);

    setTimeout(() => {
      // Deterministic generation based on inputs
      const skills = quizSkills.toLowerCase();
      const interests = quizInterests.toLowerCase();

      const ideas = [];
      if (skills.includes('python') || interests.includes('ai') || interests.includes('machine learning')) {
        ideas.push({
          id: 'idea-ai-med',
          name: 'AI Medical Document Summarizer',
          description: 'A desktop layout scanning medical journal PDFs, extracting clinical keywords, and drafting summaries using a quantized local hugging face weights stack.',
          problem: 'Medical students lose hours reading lengthy research journals.',
          audience: 'Research assistants and medical undergraduates.',
          tech: 'Python, FastAPI, PyTorch, React',
          duration: '2-3 months',
          teamSize: '3'
        });
        ideas.push({
          id: 'idea-career',
          name: 'Personalized Career Recommendation Model',
          description: 'An AI engine mapping student github profiles, courses completed, and bio fields to recommend job categories and lacking skill credentials.',
          problem: 'Undergraduates lack direction when aligning course loads to industry internship requirements.',
          audience: 'Academic counselors and college juniors.',
          tech: 'Python, Flask, React, PostgreSQL',
          duration: '1 month',
          teamSize: '2'
        });
      } else {
        ideas.push({
          id: 'idea-freelance',
          name: 'Student Freelance Exchange Hub',
          description: 'A minimal gig workspace letting college designers and developers team up on quick local client contracts, managing agreements with secure milestones.',
          problem: 'Students need real-world contract portfolios but struggle to find trusted client deals.',
          audience: 'Freelance student builders and small businesses.',
          tech: 'React, Node.js, PostgreSQL, Tailwind CSS',
          duration: '2-3 months',
          teamSize: '4'
        });
      }

      // Add a generic fallback idea
      ideas.push({
        id: 'idea-campus',
        name: 'Smart Campus Commute Share',
        description: 'A mobile application allowing campus students to coordinate carpools and coordinate schedules, saving parking costs and carbon footprints.',
        problem: 'Commuter students pay high transit fees and parking lots are overloaded.',
        audience: 'Campus commuters.',
        tech: 'React Native, Expo, SQLite, Firebase',
        duration: '1 month',
        teamSize: '3'
      });

      setGeneratedIdeas(ideas);
      setQuizLoading(false);
    }, 1000);
  };

  const handleStartGeneratedProject = (idea: any) => {
    // Navigate to wizard pre-populated with generated parameters
    navigate(`/idea/wizard`);
  };

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'College Project', label: 'College Projects' },
    { value: 'Hackathon', label: 'Hackathons' },
    { value: 'Startup', label: 'Startups' },
    { value: 'Open Source', label: 'Open Source' },
    { value: 'Research', label: 'Research' },
    { value: 'Personal Project', label: 'Personal Projects' }
  ];

  const difficultyOptions = [
    { value: 'All', label: 'All Difficulties' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  const techOptions = [
    { value: 'All', label: 'All Technologies' },
    { value: 'React', label: 'React' },
    { value: 'Python', label: 'Python' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'PostgreSQL', label: 'PostgreSQL' },
    { value: 'C++', label: 'C++' },
    { value: 'Rust', label: 'Rust' }
  ];

  return (
    <div className="space-y-6 fade-in-up text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Discover Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Browse active student concepts or generate new ideas matching your skills.</p>
        </div>
        <div className="flex space-x-2 shrink-0">
          <Button 
            variant={mode === 'browse' ? 'primary' : 'secondary'} 
            size="sm"
            onClick={() => setMode('browse')}
          >
            Browse Projects
          </Button>
          <Button 
            variant={mode === 'generator' ? 'primary' : 'secondary'} 
            size="sm"
            onClick={() => setMode('generator')}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            I Need an Idea
          </Button>
        </div>
      </div>

      {/* 1. BROWSE PROJECTS MODE */}
      {mode === 'browse' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <Card className="p-4 bg-white border border-slate-100 flex flex-col md:flex-row items-center gap-3 shadow-premium">
            <div className="flex-1 w-full relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search description, name, technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 focus:outline-none"
              >
                {categoryOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 focus:outline-none"
              >
                {difficultyOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <select
                value={techFilter}
                onChange={(e) => setTechFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 focus:outline-none"
              >
                {techOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Projects Listing Grid */}
          {filteredProjects.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-200 max-w-lg mx-auto">
              <HelpCircle className="h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-700 mb-1">No Projects Found</h3>
              <p className="text-xs text-slate-400">Try adjusting your filters or search queries to discover more concepts.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => {
                const match = calculateMatchScore(project);
                const isSaved = bookmarks.projectIds.includes(project.id);
                const creator = students.find(s => s.id === project.creatorId);

                // Calculate unfilled roles slots size
                const openSlots = project.suggestedRoles.reduce((acc, r) => acc + (r.count - r.filled), 0);

                return (
                  <Card 
                    key={project.id} 
                    hoverable 
                    className="flex flex-col justify-between cursor-pointer border-slate-100 shadow-premium"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="space-y-4">
                      
                      {/* Header bookmark + Match % */}
                      <div className="flex justify-between items-center">
                        <Badge variant={match.percent >= 90 ? 'primary' : 'neutral'} size="sm">
                          {match.percent}% Compatible
                        </Badge>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmarkProject(project.id);
                          }}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isSaved 
                              ? 'bg-primary-50 border-primary-200 text-primary-600'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Project identity */}
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">{project.category}</span>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug mt-0.5 truncate">{project.name}</h3>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal truncate-3-lines">{project.description}</p>
                      </div>

                      {/* Skills match highlights */}
                      {match.matching.length > 0 && (
                        <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-500 border border-slate-100">
                          <span className="font-semibold text-slate-700">Skills Overlap: </span>
                          {match.matching.join(', ')}
                        </div>
                      )}

                      {/* Info badges */}
                      <div className="flex flex-wrap gap-1">
                        {project.requiredSkills.map(sk => (
                          <Badge key={sk.name} variant="neutral" size="sm" className="text-[8px] px-1 py-0.2 bg-slate-50">{sk.name}</Badge>
                        ))}
                      </div>

                    </div>

                    {/* Footer creators avatar + Slots */}
                    <div className="border-t border-slate-50 mt-5 pt-3.5 flex justify-between items-center shrink-0">
                      <div className="flex items-center space-x-2">
                        <Avatar name={creator?.name || 'Anonymous'} src={creator?.avatarUrl} size="xs" />
                        <span className="text-[10px] text-slate-500 font-medium">By {creator?.name.split(' ')[0]}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={openSlots > 0 ? 'warning' : 'neutral'} size="sm" className="text-[9px]">
                          {openSlots > 0 ? `${openSlots} slots` : 'Full'}
                        </Badge>
                        <span className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-0.5">
                          <span>Browse Project</span>
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>

                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. NEED A PROJECT IDEA MODE */}
      {mode === 'generator' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-6 md:p-8 text-left space-y-5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl border border-primary-100">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">I Need an Idea</h3>
                <p className="text-xs text-slate-400 mt-0.5">Let us recommend project proposals matching your skills and interests.</p>
              </div>
            </div>

            <form onSubmit={handleGenerateIdeas} className="space-y-4 pt-2">
              <Input
                label="Core Skills You Want to Practice"
                placeholder="e.g. React, Python, Figma, PostgreSQL"
                value={quizSkills}
                onChange={(e) => setQuizSkills(e.target.value)}
                required
              />
              <Input
                label="Topics / Domains of Interest"
                placeholder="e.g. Healthcare, Climate, Blockchain, Education"
                value={quizInterests}
                onChange={(e) => setQuizInterests(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Difficulty Target"
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value)}
                  options={[
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' }
                  ]}
                />
                <div className="flex items-end">
                  <Button type="submit" variant="primary" className="w-full font-semibold" isLoading={quizLoading}>
                    Generate Project Ideas
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Generated Ideas listings */}
          {generatedIdeas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-left">Suggested Ideas</h3>
              {generatedIdeas.map((idea, i) => (
                <Card key={i} className="p-5 text-left border-l-4 border-l-primary-500 space-y-3.5 shadow-premium">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{idea.name}</h4>
                    <Badge variant="primary" size="sm">{idea.duration}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{idea.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-3 text-left">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Problem</span>
                      <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">{idea.problem}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Target Tech</span>
                      <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">{idea.tech}</p>
                    </div>
                  </div>

                  <div className="flex justify-end items-center space-x-2 pt-2 border-t border-slate-50 shrink-0">
                    <button
                      onClick={() => {
                        toggleBookmarkIdea(idea.id);
                        const isSaved = bookmarks.ideaIds.includes(idea.id);
                        setToastMsg(isSaved ? `Removed "${idea.name}" from bookmarks.` : `Bookmarked "${idea.name}"!`);
                      }}
                      className={`p-1.5 border rounded-lg transition-all shadow-sm ${
                        bookmarks.ideaIds.includes(idea.id)
                          ? 'bg-primary-50 border-primary-200 text-primary-600 hover:bg-primary-100'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                      title={bookmarks.ideaIds.includes(idea.id) ? 'Remove Bookmark' : 'Bookmark Idea'}
                    >
                      <Bookmark className="h-4 w-4" fill={bookmarks.ideaIds.includes(idea.id) ? 'currentColor' : 'none'} />
                    </button>
                    <Button 
                      size="sm" 
                      onClick={() => handleStartGeneratedProject(idea)}
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      Start Project Wizard
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PROJECT DETAIL MODAL */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name || ''}
      >
        {selectedProject && (() => {
          const ownerStudent = students.find(s => s.id === selectedProject.creatorId);
          const openSlots = selectedProject.suggestedRoles.reduce((acc, r) => acc + (r.count - r.filled), 0);
          const hasUnfilledSlots = openSlots > 0;
          return (
            <div className="space-y-5 text-left font-sans">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{selectedProject.category}</span>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">{selectedProject.description}</p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100/60">
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider block">Difficulty</span>
                  <Badge variant="primary" size="sm" className="mt-1 text-[9px] font-semibold">{selectedProject.difficulty}</Badge>
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider block">Duration</span>
                  <span className="text-xs font-semibold text-slate-700 mt-1 block">{selectedProject.duration}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider block">Target Deadline</span>
                  <span className="text-xs font-semibold text-slate-700 mt-1 block">{selectedProject.deadline || 'December 15, 2026'}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider block">Progress</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-16 bg-slate-200 rounded-full h-1.5">
                      <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${selectedProject.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">{selectedProject.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Problem / Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Statement</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{selectedProject.problemSolved}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Solution Proposal</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {selectedProject.showcase?.solution || "Build a responsive web application to solve the target users' paint points."}
                  </p>
                </div>
              </div>

              {/* Required Skills & Tech Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.requiredSkills?.map(s => (
                      <Badge key={s.name} variant="neutral" size="sm" className="text-[9px] bg-slate-50 border-none">
                        {s.name} ({s.level})
                      </Badge>
                    )) || <span className="text-xs text-slate-500">None specified</span>}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.technologies.map(t => (
                      <Badge key={t.name} variant="neutral" size="sm" className="bg-slate-50 border-none font-medium">
                        {t.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Members List */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Team Members</h4>
                <div className="flex flex-col space-y-1.5">
                  {selectedProject.members.map(m => {
                    const student = students.find(s => s.id === m.studentId);
                    return (
                      <div key={m.studentId} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                        <div className="flex items-center space-x-2">
                          <Avatar name={student?.name || 'Anonymous'} src={student?.avatarUrl} size="xs" />
                          <div>
                            <span className="text-xs font-semibold text-slate-700">{student?.name || 'Anonymous'}</span>
                            <span className="text-[9px] text-slate-400 block">{m.role}</span>
                          </div>
                        </div>
                        <Badge variant={m.status === 'Joined' ? 'success' : 'warning'} size="sm" className="text-[8px] uppercase tracking-wider scale-90">
                          {m.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Open Roles list */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Open Vacant Roles</h4>
                <div className="space-y-2">
                  {selectedProject.suggestedRoles.map(role => {
                    const slotsOpen = role.count - role.filled;
                    if (slotsOpen <= 0) return null;
                    return (
                      <div key={role.name} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 shadow-premium bg-slate-50/20">
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 leading-snug">{role.name}</h5>
                          <p className="text-[9px] text-slate-400 mt-0.5">Required: {role.skills.join(', ')}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleApplyRole(role)}
                          className="text-[11px] px-3 py-1 font-semibold"
                        >
                          Apply Role
                        </Button>
                      </div>
                    );
                  })}
                  {openSlots === 0 && (
                    <span className="text-xs text-slate-500">All positions have been filled.</span>
                  )}
                </div>
              </div>

              {/* Owner and Actions Block */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Project Owner</span>
                  <div className="flex items-center space-x-2">
                    <Avatar name={ownerStudent?.name || 'Owner'} src={ownerStudent?.avatarUrl} size="sm" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block leading-snug">{ownerStudent?.name || 'Anonymous'}</span>
                      <span className="text-[10px] text-slate-500">{ownerStudent?.course} • {ownerStudent?.college}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 shrink-0">
                  <button
                    onClick={() => toggleBookmarkProject(selectedProject.id)}
                    className={`p-2 border rounded-xl transition-all shadow-sm ${
                      bookmarks.projectIds.includes(selectedProject.id)
                        ? 'bg-primary-50 border-primary-200 text-primary-600 hover:bg-primary-100'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title={bookmarks.projectIds.includes(selectedProject.id) ? 'Remove Bookmark' : 'Bookmark Project'}
                  >
                    <Bookmark className="h-4.5 w-4.5" fill={bookmarks.projectIds.includes(selectedProject.id) ? 'currentColor' : 'none'} />
                  </button>

                  {selectedProject.creatorId !== currentUser.id && (
                    hasUnfilledSlots ? (
                      <button
                        onClick={handleDirectJoin}
                        className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition-colors"
                      >
                        Direct Join Team
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed"
                      >
                        Team Full
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* 4. SUBMIT APPLICATION MODAL */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply as ${applyingRole?.name}`}
        footer={
          <>
            <button
              onClick={() => setApplyModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold border rounded-lg transition-colors bg-white font-sans"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitApplication}
              className="px-4 py-1.5 text-xs text-white bg-primary-600 hover:bg-primary-700 font-semibold rounded-lg shadow-sm transition-colors font-sans"
            >
              Submit Application
            </button>
          </>
        }
      >
        <div className="space-y-4 text-left font-sans">
          <p className="text-xs text-slate-500 leading-relaxed">
            By applying, the project creator will receive a notification of your interest, your onboarding skills registry, and collaboration standings.
          </p>
          <div className="space-y-3">
            <div>
              <label htmlFor="app-pitch" className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Why do you want to join? (Pitch)</label>
              <textarea
                id="app-pitch"
                rows={3}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Briefly explain your interest..."
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="app-skills" className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">What skills can you contribute?</label>
              <input
                id="app-skills"
                type="text"
                value={contributeSkills}
                onChange={(e) => setContributeSkills(e.target.value)}
                placeholder="React, TypeScript, Figma..."
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Toast Alert */}
      {toastMsg && (
        <Toast 
          message={toastMsg} 
          onClose={() => setToastMsg('')} 
        />
      )}

    </div>
  );
};
export default DiscoverProjects;
