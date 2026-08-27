import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { 
  Bookmark, 
  Layers, 
  Trophy, 
  ExternalLink,
  Info,
  Calendar,
  XSquare,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Project, Hackathon } from '../../types';

export const Bookmarks: React.FC = () => {
  const { 
    currentUser, 
    projects, 
    hackathons, 
    students,
    bookmarks, 
    toggleBookmarkProject, 
    toggleBookmarkHackathon,
    updateProject,
    toggleBookmarkStudent,
    toggleBookmarkIdea
  } = useApp();
  
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'projects' | 'hackathons' | 'students' | 'ideas'>('projects');
  
  // Modal details
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  if (!currentUser) return null;

  // Filter saved projects
  const savedProjects = projects.filter(p => bookmarks.projectIds.includes(p.id));
  
  // Filter saved hackathons
  const savedHackathons = hackathons.filter(h => bookmarks.hackathonIds.includes(h.id));

  // Filter saved students
  const savedStudents = students.filter(s => bookmarks.studentIds.includes(s.id));

  // Recommended ideas list
  const mockIdeas = [
    {
      id: 'idea-ai-med',
      name: 'AI Medical Document Summarizer',
      description: 'A desktop layout scanning medical journal PDFs, extracting clinical keywords, and drafting summaries using a quantized local hugging face weights stack.',
      problem: 'Medical students lose hours reading lengthy research journals.',
      audience: 'Research assistants and medical undergraduates.',
      tech: 'Python, FastAPI, PyTorch, React',
      duration: '2-3 months',
      teamSize: '3'
    },
    {
      id: 'idea-career',
      name: 'Personalized Career Recommendation Model',
      description: 'An AI engine mapping student github profiles, courses completed, and bio fields to recommend job categories and lacking skill credentials.',
      problem: 'Undergraduates lack direction when aligning course loads to industry internship requirements.',
      audience: 'Academic counselors and college juniors.',
      tech: 'Python, Flask, React, PostgreSQL',
      duration: '1 month',
      teamSize: '2'
    },
    {
      id: 'idea-freelance',
      name: 'Student Freelance Exchange Hub',
      description: 'A minimal gig workspace letting college designers and developers team up on quick local client contracts, managing agreements with secure milestones.',
      problem: 'Students need real-world contract portfolios but struggle to find trusted client deals.',
      audience: 'Freelance student builders and small businesses.',
      tech: 'React, Node.js, PostgreSQL, Tailwind CSS',
      duration: '2-3 months',
      teamSize: '4'
    },
    {
      id: 'idea-campus',
      name: 'Smart Campus Commute Share',
      description: 'A mobile application allowing campus students to coordinate carpools and coordinate schedules, saving parking costs and carbon footprints.',
      problem: 'Commuter students pay high transit fees and parking lots are overloaded.',
      audience: 'Campus commuters.',
      tech: 'React Native, Expo, SQLite, Firebase',
      duration: '1 month',
      teamSize: '3'
    }
  ];
  
  const savedIdeas = mockIdeas.filter(i => bookmarks.ideaIds.includes(i.id));

  const handleRemoveProject = (id: string, name: string) => {
    toggleBookmarkProject(id);
    setToastMsg(`Removed "${name}" from bookmarks.`);
  };

  const handleRemoveHackathon = (id: string, name: string) => {
    toggleBookmarkHackathon(id);
    setToastMsg(`Removed "${name}" from bookmarks.`);
  };

  const handleDirectJoin = () => {
    if (!currentUser || !selectedProject) return;

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
    setSelectedProject(null);
  };

  return (
    <div className="space-y-6 fade-in-up text-left font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bookmarks</h1>
        <p className="text-xs text-slate-500 mt-1">Review saved hackathons events and project design proposals.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 font-medium text-sm border-b-2 transition-colors focus:outline-none flex items-center space-x-2 ${
              activeTab === 'projects'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Saved Projects</span>
            <Badge variant="neutral" size="sm" className="ml-1 bg-slate-100">{savedProjects.length}</Badge>
          </button>
          <button
            onClick={() => setActiveTab('hackathons')}
            className={`pb-3 font-medium text-sm border-b-2 transition-colors focus:outline-none flex items-center space-x-2 ${
              activeTab === 'hackathons'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Saved Hackathons</span>
            <Badge variant="neutral" size="sm" className="ml-1 bg-slate-100">{savedHackathons.length}</Badge>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 font-medium text-sm border-b-2 transition-colors focus:outline-none flex items-center space-x-2 ${
              activeTab === 'students'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Saved Teammates</span>
            <Badge variant="neutral" size="sm" className="ml-1 bg-slate-100">{savedStudents.length}</Badge>
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`pb-3 font-medium text-sm border-b-2 transition-colors focus:outline-none flex items-center space-x-2 ${
              activeTab === 'ideas'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Saved Ideas</span>
            <Badge variant="neutral" size="sm" className="ml-1 bg-slate-100">{savedIdeas.length}</Badge>
          </button>
        </nav>
      </div>

      {/* Grid listing */}
      {activeTab === 'projects' && (
        savedProjects.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-200 max-w-md mx-auto">
            <Bookmark className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-400 mb-4">No saved projects bookmarks.</p>
            <Button size="sm" onClick={() => navigate('/discover')}>Discover Projects</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedProjects.map(proj => (
              <Card 
                key={proj.id} 
                hoverable 
                className="flex flex-col justify-between cursor-pointer border-slate-100 shadow-premium"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-left">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{proj.category}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProject(proj.id, proj.name);
                      }}
                      className="p-1.5 rounded bg-white text-slate-400 hover:text-red-500 border transition-colors shrink-0"
                    >
                      <XSquare className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug truncate">{proj.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 truncate-2-lines">{proj.description}</p>
                  </div>
                </div>

                <div className="border-t border-slate-50 mt-5 pt-3.5 flex justify-between items-center text-[10px] text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Layers className="h-3.5 w-3.5" />
                    <span>{proj.difficulty} Level</span>
                  </div>
                  <Badge variant="primary" size="sm">Open</Badge>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {activeTab === 'hackathons' && (
        savedHackathons.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-200 max-w-md mx-auto">
            <Trophy className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-400 mb-4">No saved hackathons bookmarks.</p>
            <Button size="sm" onClick={() => navigate('/hackathons')}>Explore Hackathons</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedHackathons.map(hack => (
              <Card key={hack.id} className="flex flex-col justify-between border-slate-100 shadow-premium">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3 text-left">
                      <img src={hack.logo} alt="" className="h-10 w-10 rounded-xl object-cover border" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{hack.name}</h4>
                        <span className="text-[9px] text-slate-400">{hack.theme}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveHackathon(hack.id, hack.name)}
                      className="p-1.5 rounded bg-white text-slate-400 hover:text-red-500 border transition-colors shrink-0"
                    >
                      <XSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-50 mt-5 pt-4 flex justify-between items-center text-[10px] text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due: {hack.deadline}</span>
                  </div>
                  <Button size="sm" className="text-[10px] py-1 px-2.5 font-semibold" onClick={() => navigate('/team-builder')}>Find Teammates</Button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {activeTab === 'students' && (
        savedStudents.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-200 max-w-md mx-auto">
            <Users className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-400 mb-4">No saved student bookmarks.</p>
            <Button size="sm" onClick={() => navigate('/team-builder')}>Find Teammates</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedStudents.map(student => (
              <Card 
                key={student.id} 
                hoverable 
                className="flex flex-col justify-between cursor-pointer border-slate-100 shadow-premium p-5 text-left"
                onClick={() => navigate(`/profile?id=${student.id}`)}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Avatar name={student.name} src={student.avatarUrl} score={student.collaborationScore} size="md" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{student.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{student.course} • {student.college.split(' ')[0]}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmarkStudent(student.id);
                        setToastMsg(`Removed ${student.name} from bookmarks.`);
                      }}
                      className="p-1.5 rounded bg-white text-slate-400 hover:text-red-500 border transition-colors shrink-0"
                    >
                      <XSquare className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{student.bio}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {student.skills.slice(0, 3).map(s => (
                      <Badge key={s.name} variant="neutral" size="sm" className="text-[8px] bg-slate-50">{s.name}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {activeTab === 'ideas' && (
        savedIdeas.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-200 max-w-md mx-auto">
            <Sparkles className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-400 mb-4">No saved recommended ideas bookmarks.</p>
            <Button size="sm" onClick={() => navigate('/discover')}>Discover Ideas</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedIdeas.map(idea => (
              <Card key={idea.id} className="p-5 text-left border-l-4 border-l-primary-500 space-y-3.5 shadow-premium">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{idea.name}</h4>
                  <button
                    onClick={() => {
                      toggleBookmarkIdea(idea.id);
                      setToastMsg(`Removed "${idea.name}" from bookmarks.`);
                    }}
                    className="p-1.5 rounded bg-white text-slate-400 hover:text-red-500 border transition-colors shrink-0"
                  >
                    <XSquare className="h-4 w-4" />
                  </button>
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
                
                <div className="flex justify-end pt-2 border-t border-slate-50 shrink-0">
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/idea/wizard')}
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    Start Project Wizard
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Project detail modal */}
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
                        {s.name} ({s.priority})
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
                        <span className="text-xs font-bold text-primary-600">
                          {slotsOpen} slots vacant
                        </span>
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

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

    </div>
  );
};
export default Bookmarks;
