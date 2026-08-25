import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { ProgressBar } from '../../components/ProgressBar';
import { 
  Sparkles, 
  Users, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Info,
  Clock,
  CheckCircle,
  FileCode2,
  Trophy,
  ArrowUpRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, projects, students, hackathons, notifications, connections, acceptConnectionRequest, rejectConnectionRequest } = useApp();
  const navigate = useNavigate();
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  if (!currentUser) return null;

  // Determine greeting based on current local hours
  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

  // 1. Filter out user's active/created projects
  const myProjects = projects.filter(p => 
    p.creatorId === currentUser.id || 
    p.members.some(m => m.studentId === currentUser.id && m.status === 'Joined')
  );

  // 2. Recommendations Engine (Deterministic client side logic)
  const getProjectRecommendation = () => {
    // Find project looking for roles that match user's skills
    const userSkills = currentUser.skills.map(s => s.name.toLowerCase());
    
    const recommended = projects.filter(p => {
      // Don't recommend own projects
      const isMine = p.creatorId === currentUser.id || p.members.some(m => m.studentId === currentUser.id);
      if (isMine) return false;
      
      // Look for unfilled roles matching user skills
      const hasMatchingRole = p.suggestedRoles.some(r => 
        r.filled < r.count && 
        r.skills.some(s => userSkills.includes(s.toLowerCase()))
      );
      return hasMatchingRole;
    });

    if (recommended.length > 0) {
      const proj = recommended[0];
      const matchRole = proj.suggestedRoles.find(r => 
        r.filled < r.count && 
        r.skills.some(s => userSkills.includes(s.toLowerCase()))
      );
      return {
        project: proj,
        why: `Recommended because they need a ${matchRole?.name || 'teammate'} and you have: ${matchRole?.skills.filter(s => userSkills.includes(s.toLowerCase())).join(', ')}`
      };
    }

    // Default fallback project
    const defaultProj = projects.find(p => p.creatorId !== currentUser.id);
    return defaultProj ? {
      project: defaultProj,
      why: 'Suggested because of its strong learning difficulty alignment with your profile.'
    } : null;
  };

  const getStudentRecommendation = () => {
    // Find students whose skills complement user's skills (e.g. if user does Frontend, recommend backend/designers)
    const userSkills = currentUser.skills.map(s => s.name.toLowerCase());
    const isFrontend = userSkills.includes('react') || userSkills.includes('figma');

    const recommended = students.filter(s => {
      if (s.id === currentUser.id) return false;
      
      const otherSkills = s.skills.map(sk => sk.name.toLowerCase());
      if (isFrontend) {
        // Recommend backend
        return otherSkills.includes('node.js') || otherSkills.includes('postgresql') || otherSkills.includes('python');
      } else {
        // Recommend frontend/design
        return otherSkills.includes('react') || otherSkills.includes('figma') || otherSkills.includes('ui/ux design');
      }
    });

    if (recommended.length > 0) {
      const student = recommended[0];
      const matchedSkill = student.skills.find(sk => 
        isFrontend 
          ? ['node.js', 'postgresql', 'python'].includes(sk.name.toLowerCase())
          : ['react', 'figma', 'ui/ux design'].includes(sk.name.toLowerCase())
      );
      return {
        student,
        why: `Recommended because their ${matchedSkill?.name || 'skills'} complement your profile.`
      };
    }

    // Fallback student
    const defaultStudent = students.find(s => s.id !== currentUser.id);
    return defaultStudent ? {
      student: defaultStudent,
      why: 'Suggested student who matches your college cohort.'
    } : null;
  };

  const getHackathonRecommendation = () => {
    const userInterests = currentUser.interests.map(i => i.toLowerCase());
    const recommended = hackathons.filter(h => 
      h.requiredSkills.some(s => currentUser.skills.some(cs => cs.name.toLowerCase() === s.toLowerCase())) ||
      userInterests.some(ui => h.theme.toLowerCase().includes(ui))
    );
    if (recommended.length > 0) {
      return {
        hackathon: recommended[0],
        why: 'Suggested because it matches your core technical skill stack.'
      };
    }
    return {
      hackathon: hackathons[0],
      why: 'Featured hackathon with active student team requests.'
    };
  };

  const projectRec = getProjectRecommendation();
  const studentRec = getStudentRecommendation();
  const hackathonRec = getHackathonRecommendation();

  // 3. Next Actions logic
  const getNextAction = () => {
    // If no active projects
    if (myProjects.length === 0) {
      return {
        title: "Start building your portfolio",
        description: "Have a project idea? Describe it, and ProjectHub will draft technology configurations, task backlogs, and suggest teammate profiles.",
        ctaText: "I Have an Idea",
        action: () => navigate('/idea/wizard'),
        icon: <Sparkles className="h-5 w-5 text-purple-500" />
      };
    }

    // Find if user created a project that has unfilled roles
    const myCreatedProjects = projects.filter(p => p.creatorId === currentUser.id && p.status === 'Planning');
    if (myCreatedProjects.length > 0) {
      const proj = myCreatedProjects[0];
      const unfilledCount = proj.suggestedRoles.reduce((acc, r) => acc + (r.count - r.filled), 0);
      if (unfilledCount > 0) {
        return {
          title: `Find teammates for "${proj.name}"`,
          description: `Your project needs ${unfilledCount} more role${unfilledCount > 1 ? 's' : ''} filled. View matching profiles and send connection invitations.`,
          ctaText: "Find Teammates",
          action: () => navigate('/team-builder'),
          icon: <Users className="h-5 w-5 text-blue-500" />
        };
      }
    }

    // Default to task tracking
    const incompleteTasks = myProjects.reduce((acc, p) => acc + p.tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'Done').length, 0);
    if (incompleteTasks > 0) {
      return {
        title: "Track your tasks due this week",
        description: `You have ${incompleteTasks} pending task${incompleteTasks > 1 ? 's' : ''} assigned to you. Keep your team updated by moving items on the board.`,
        ctaText: "View My Tasks",
        action: () => navigate('/my-projects'),
        icon: <CheckCircle className="h-5 w-5 text-emerald-500" />
      };
    }

    return {
      title: "Explore hackathon collaborations",
      description: "Ready for a weekend sprint? Check out active hackathons, save events, and search for students building teams.",
      ctaText: "Explore Hackathons",
      action: () => navigate('/hackathons'),
      icon: <Trophy className="h-5 w-5 text-amber-500" />
    };
  };

  const nextAction = getNextAction();

  // Find incoming pending requests
  const pendingRequests = connections.filter(c => c.receiverId === currentUser.id && c.status === 'Pending');

  return (
    <div className="space-y-6 fade-in-up text-left">
      
      {/* Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {greeting}, {currentUser.name} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back. Here is what is happening with your projects and matching teammates today.
          </p>
        </div>
        <div className="flex space-x-2 shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/my-projects')}
            className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            My Projects
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/discover')}
            leftIcon={<Users className="h-4 w-4" />}
          >
            Find Teammates
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/idea/wizard')}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            I Have an Idea
          </Button>
        </div>
      </div>

      {/* Main Grid: Left 2/3 and Right 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tips and Projects */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Actionable advisor banner */}
          <Card className="border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50/30 to-white">
            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-white shadow-premium rounded-xl shrink-0">
                {nextAction.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wider">
                  Recommended Action
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{nextAction.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {nextAction.description}
                </p>
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    onClick={nextAction.action}
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    className="font-semibold text-xs py-1.5"
                  >
                    {nextAction.ctaText}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Pending Requests Queue (Conditional) */}
          {pendingRequests.length > 0 && (
            <Card className="border-amber-100 bg-amber-50/20">
              <div className="flex items-start space-x-3 mb-3">
                <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pending Connection Requests</h3>
                  <p className="text-xs text-slate-500">Other students want to coordinate skills. Reveal identities by accepting.</p>
                </div>
              </div>
              <div className="space-y-3 mt-3">
                {pendingRequests.map(req => {
                  const reqStudent = students.find(s => s.id === req.senderId);
                  return (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-premium">
                      <div className="flex items-center space-x-2.5">
                        <Avatar name={reqStudent?.name || 'Anonymous'} src={reqStudent?.avatarUrl} size="sm" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{reqStudent?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{reqStudent?.course} • {reqStudent?.college}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => rejectConnectionRequest(req.senderId || '')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                        >
                          Ignore
                        </button>
                        <button
                          onClick={() => acceptConnectionRequest(req.senderId || '')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* My Active Projects */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">My Active Projects</h2>
              {myProjects.length > 0 && (
                <Link to="/my-projects" className="text-xs font-semibold text-primary-600 hover:text-primary-500 flex items-center space-x-1">
                  <span>View all</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            {myProjects.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-200">
                <FileCode2 className="h-8 w-8 text-slate-300 mb-3" />
                <h3 className="text-xs font-bold text-slate-700 mb-1">No Projects Active Yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  Turn your idea into a roadmap configurations and get teammates matches in minutes.
                </p>
                <Button size="sm" onClick={() => navigate('/idea/wizard')}>
                  Start Project Idea
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myProjects.map(project => {
                  const activeMilestones = project.roadmap.filter(m => m.status === 'In Progress');
                  const nextTask = project.tasks.find(t => t.status === 'TODO' && (t.assigneeId === currentUser.id || !t.assigneeId));
                  return (
                    <Card key={project.id} hoverable className="cursor-pointer flex flex-col justify-between" onClick={() => navigate(`/my-projects?id=${project.id}`)}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{project.category}</span>
                            <h3 className="text-sm font-bold text-slate-800 truncate mt-0.5 max-w-[200px]">{project.name}</h3>
                          </div>
                          <Badge variant={project.status === 'Completed' ? 'success' : 'primary'} size="sm">
                            {project.status}
                          </Badge>
                        </div>
                        <ProgressBar value={project.progress} showLabel size="sm" />
                      </div>
                      <div className="border-t border-slate-50 mt-4 pt-3 text-left space-y-2 shrink-0">
                        {activeMilestones.length > 0 ? (
                          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                            <Clock className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                            <span className="truncate">Current: <span className="font-semibold text-slate-700">{activeMilestones[0].name}</span></span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>No active milestones</span>
                          </div>
                        )}
                        {nextTask && (
                          <div className="flex items-center space-x-1.5 text-[10px] bg-slate-50 px-2 py-1 rounded-md text-slate-500 truncate">
                            <span className="font-semibold text-slate-700 uppercase tracking-wider shrink-0 text-[8px] bg-white border border-slate-200 px-1 rounded">Next task</span>
                            <span className="truncate">{nextTask.title}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile summary & Match cards */}
        <div className="space-y-6">
          
          {/* Collaboration Score & Reputation Panel */}
          <Card className="text-center relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collaboration Reputation</span>
              <button 
                onClick={() => setShowScoreInfo(!showScoreInfo)}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            
            {showScoreInfo ? (
              <div className="text-left text-xs bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed text-slate-500 mb-2">
                <p className="font-bold text-slate-700 mb-1">How is this calculated?</p>
                Your score aggregates technical feedback, roadmap task completion ratios, responsiveness in project chat, and peer ratings submitted at milestones. Keep it high to rank higher in matchmaking lists!
              </div>
            ) : null}

            <div className="flex flex-col items-center py-4">
              <div className="relative inline-flex items-center justify-center">
                {/* SVG Radial Gauge */}
                <svg className="w-24 h-24">
                  <circle className="text-slate-100" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                  <circle className="text-primary-600" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * currentUser.collaborationScore) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-slate-900">{currentUser.collaborationScore}</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">/100</span>
                </div>
              </div>
              
              <h3 className="text-sm font-semibold text-slate-800 mt-3">Excellent Standings</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-0.5 leading-relaxed">
                You rank in the top 5% of collaborators this semester.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 border-t border-slate-50 pt-3">
              {currentUser.reputationTags.map(tag => (
                <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
              ))}
            </div>
          </Card>

          {/* Dynamic Recommendations Sidebar */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 text-left">Recommended for You</h2>
            
            {/* 1. Recommended Project */}
            {projectRec && (
              <Card hoverable className="p-4 border-l-2 border-l-primary-500 cursor-pointer" onClick={() => navigate(`/discover?id=${projectRec.project.id}`)}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PROJECT MATCH</span>
                  <Badge variant="primary" size="sm">94% Match</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">{projectRec.project.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal truncate">{projectRec.project.description}</p>
                
                <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-500 mt-3 flex items-start space-x-1.5">
                  <Info className="h-3.5 w-3.5 text-primary-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{projectRec.why}</span>
                </div>
              </Card>
            )}

            {/* 2. Recommended Teammate */}
            {studentRec && (
              <Card hoverable className="p-4 border-l-2 border-l-emerald-500 cursor-pointer" onClick={() => navigate(`/team-builder?id=${studentRec.student.id}`)}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TEAMMATE MATCH</span>
                  <Badge variant="success" size="sm">92% Match</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar name={studentRec.student.name} src={studentRec.student.avatarUrl} size="sm" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">{studentRec.student.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate leading-none">{studentRec.student.course} • {studentRec.student.college}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-500 mt-3 flex items-start space-x-1.5">
                  <Info className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{studentRec.why}</span>
                </div>
              </Card>
            )}

            {/* 3. Recommended Hackathon */}
            {hackathonRec && (
              <Card hoverable className="p-4 border-l-2 border-l-amber-500 cursor-pointer" onClick={() => navigate('/hackathons')}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">HACKATHON MATCH</span>
                  <Badge variant="warning" size="sm">Active</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <img src={hackathonRec.hackathon.logo} alt="" className="h-7 w-7 rounded-lg object-cover border shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">{hackathonRec.hackathon.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-none">Deadline: {hackathonRec.hackathon.deadline}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-500 mt-3 flex items-start space-x-1.5">
                  <Info className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{hackathonRec.why}</span>
                </div>
              </Card>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
