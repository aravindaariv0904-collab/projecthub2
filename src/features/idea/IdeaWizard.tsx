import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { analyzeIdea as runAnalysis } from '../../services/recommender';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';
import { Project, Technology, SuggestedRole, Milestone, Task } from '../../types';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Settings, 
  Layers, 
  Calendar, 
  Users, 
  Flame, 
  CheckCircle,
  HelpCircle,
  Clock,
  Compass,
  FileCode2,
  Workflow
} from 'lucide-react';

export const IdeaWizard: React.FC = () => {
  const { currentUser, addProject } = useApp();
  const navigate = useNavigate();

  // Wizard flow state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Form inputs state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [category, setCategory] = useState<any>('College Project');
  const [techLevel, setTechLevel] = useState<'know' | 'help'>('help');
  const [duration, setDuration] = useState('1 month');
  const [teamSize, setTeamSize] = useState('3');

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Loading animation triggers
  const loadingMessages = [
    'Evaluating project requirements...',
    'Matching technical stack templates...',
    'Compiling required developer skills...',
    'Drafting milestone roadmap phases...',
    'Identifying potential teammate matches...'
  ];

  useEffect(() => {
    if (loading) {
      let index = 0;
      setLoadingMessage(loadingMessages[0]);
      const interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 700);

      const timer = setTimeout(() => {
        setLoading(false);
        setShowAnalysis(true);
        clearInterval(interval);
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [loading]);

  const handleStartAnalysis = () => {
    if (!name || !description || !problemSolved || !targetUsers) {
      alert('Please fill out all survey steps before analyzing.');
      return;
    }
    
    // Call recommendation engine
    const results = runAnalysis({
      name,
      description,
      problemSolved,
      targetUsers,
      category,
      techLevel,
      duration,
      teamSize
    });

    setAnalysisResult(results);
    setLoading(true);
  };

  const handleCreateProject = (target: 'workspace' | 'matchmaker') => {
    if (!currentUser || !analysisResult) return;

    const projectId = `project-${Math.random().toString(36).substr(2, 9)}`;
    
    const newProject: Project = {
      id: projectId,
      name,
      description,
      problemSolved,
      targetUsers,
      category,
      duration,
      teamSize: parseInt(teamSize) || 3,
      difficulty: analysisResult.difficulty,
      technologies: analysisResult.technologies,
      requiredSkills: analysisResult.requiredSkills,
      suggestedRoles: analysisResult.suggestedRoles,
      roadmap: analysisResult.roadmap,
      members: [
        { studentId: currentUser.id, role: 'Project Creator', status: 'Joined' }
      ],
      tasks: analysisResult.tasks,
      chatMessages: [
        {
          id: 'sys-msg',
          senderId: 'system',
          senderName: 'ProjectHub Assistant',
          senderAvatar: '',
          content: `Welcome to your project workspace! I have pre-configured a roadmap containing ${analysisResult.roadmap.length} milestones and ${analysisResult.tasks.length} tasks based on your idea. Open the Workspace or click Team Builder to recruit matching students.`,
          timestamp: new Date().toISOString(),
          isAnnouncement: true
        }
      ],
      files: [],
      githubConnected: false,
      githubRepoName: '',
      progress: 0,
      status: 'Planning',
      creatorId: currentUser.id
    };

    addProject(newProject);

    if (target === 'workspace') {
      navigate(`/my-projects?id=${projectId}`);
    } else {
      navigate(`/team-builder?projectId=${projectId}`);
    }
  };

  const categoryOptions = [
    { value: 'College Project', label: 'College Project' },
    { value: 'Hackathon', label: 'Hackathon' },
    { value: 'Startup', label: 'Startup' },
    { value: 'Open Source', label: 'Open Source' },
    { value: 'Research', label: 'Research' },
    { value: 'Personal Project', label: 'Personal Project' }
  ];

  const durationOptions = [
    { value: '1-2 weeks', label: '1-2 weeks' },
    { value: '1 month', label: '1 month' },
    { value: '2-3 months', label: '2-3 months' },
    { value: 'Semester', label: 'Semester' },
    { value: 'Not sure', label: 'Not sure' }
  ];

  const teamSizeOptions = [
    { value: '2', label: '2 members' },
    { value: '3', label: '3 members' },
    { value: '4', label: '4 members' },
    { value: '5', label: '5+ members' },
    { value: 'Not sure', label: 'Not sure' }
  ];

  // Render Loader
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
          <Sparkles className="h-6 w-6 text-primary-500 absolute animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">Analyzing Project Concept</h3>
          <p className="text-xs text-slate-400 font-medium animate-pulse">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Render Analysis Results
  if (showAnalysis && analysisResult) {
    const { difficulty, technologies, requiredSkills, suggestedRoles, roadmap } = analysisResult;
    return (
      <div className="space-y-6 fade-in-up text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div>
            <button 
              onClick={() => setShowAnalysis(false)}
              className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-700 font-semibold mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to wizard survey</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Analysis Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">Here is a structured configuration draft mapping your idea to a roadmap, stack recommendation, and role allocations.</p>
          </div>
          <div className="flex space-x-3 shrink-0">
            <Button 
              variant="outline" 
              onClick={() => handleCreateProject('matchmaker')}
              leftIcon={<Users className="h-4 w-4" />}
            >
              Build My Team First
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleCreateProject('workspace')}
              leftIcon={<CheckCircle className="h-4 w-4" />}
            >
              Create & Open Workspace
            </Button>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-slate-50/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">PROJECT CATEGORY</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{category}</p>
          </Card>
          <Card className="p-4 bg-slate-50/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">DIFFICULTY RATING</span>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={difficulty === 'Advanced' ? 'danger' : difficulty === 'Intermediate' ? 'primary' : 'success'} size="sm">
                {difficulty}
              </Badge>
            </div>
          </Card>
          <Card className="p-4 bg-slate-50/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">EXPECTED DURATION</span>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-slate-800 font-semibold">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>{duration}</span>
            </div>
          </Card>
          <Card className="p-4 bg-slate-50/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">TEAM SIZE REQUIREMENT</span>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-slate-800 font-semibold">
              <Users className="h-4 w-4 text-slate-400" />
              <span>{teamSize} Teammates</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Summary and Technologies */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card className="space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Concept Brief</h3>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{name}</h2>
                <p className="text-xs text-slate-500 leading-relaxed mt-2">{description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-50 pt-4 text-left">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Solved</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{problemSolved}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Audience</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{targetUsers}</p>
                </div>
              </div>
            </Card>

            {/* Tech Stack */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Technology Suggestions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technologies.map((tech: Technology) => (
                  <Card key={tech.name} className="p-4 bg-white border border-slate-100 flex items-start space-x-3.5 shadow-premium hover:shadow-premium-hover transition-all">
                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600 shrink-0">
                      <FileCode2 className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-slate-800">{tech.name}</h4>
                        <Badge variant="neutral" size="sm" className="text-[9px] px-1 py-0.5">{tech.category}</Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{tech.why}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Suggested Development Roadmap</h3>
              <div className="space-y-4">
                {roadmap.map((phase: Milestone, index: number) => (
                  <div key={phase.id} className="relative flex items-start space-x-4">
                    {index < roadmap.length - 1 && (
                      <span className="absolute left-5 top-10 -bottom-6 w-0.5 bg-slate-100" />
                    )}
                    <div className="h-10 w-10 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-premium">
                      {index + 1}
                    </div>
                    <Card className="flex-1 p-4 shadow-premium hover:shadow-premium-hover transition-all text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{phase.name}</h4>
                        <Badge variant="neutral" size="sm" className="w-fit">
                          <Clock className="h-3 w-3 mr-1 inline" />
                          {phase.duration}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{phase.description}</p>
                      
                      {/* Predefined tasks tags */}
                      <div className="mt-3.5 pt-3 border-t border-slate-50">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Sample Tasks List</span>
                        <div className="flex flex-col space-y-1.5">
                          {analysisResult.tasks.filter((t: Task) => phase.tasks.includes(t.id)).map((task: Task) => (
                            <div key={task.id} className="flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <span className="font-medium text-slate-700 truncate max-w-[250px]">{task.title}</span>
                              <span className="text-[8px] bg-white border border-slate-200 text-slate-400 font-semibold px-1 py-0.5 rounded shrink-0">{task.deadline}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Roles & Skills */}
          <div className="space-y-6">
            {/* Required Skills */}
            <Card className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Required Skills Profile</h3>
              
              <div className="space-y-3 text-left">
                {['Required', 'Recommended', 'Optional'].map(priority => {
                  const items = requiredSkills.filter((sk: any) => sk.priority === priority);
                  if (items.length === 0) return null;
                  return (
                    <div key={priority}>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">{priority}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((sk: any) => (
                          <Badge 
                            key={sk.name} 
                            variant={priority === 'Required' ? 'primary' : priority === 'Recommended' ? 'info' : 'secondary'} 
                            size="sm"
                          >
                            {sk.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Team Roles */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Suggested Team Roles</h3>
              {suggestedRoles.map((role: SuggestedRole) => (
                <Card key={role.name} className="p-4 space-y-3.5 border-l-2 border-l-primary-500 shadow-premium">
                  <div className="flex justify-between items-center text-left">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{role.name}</h4>
                      <span className="text-[9px] text-slate-400">Slot Size: {role.count} member(s)</span>
                    </div>
                    <Badge variant={role.priority === 'High' ? 'danger' : role.priority === 'Medium' ? 'warning' : 'neutral'} size="sm">
                      {role.priority} Priority
                    </Badge>
                  </div>
                  
                  <div className="text-left">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">Role Competencies</span>
                    <div className="flex flex-wrap gap-1">
                      {role.skills.map(skill => (
                        <Badge key={skill} variant="neutral" size="sm" className="text-[9px] px-1.5 bg-slate-50">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Create Project Workspace Floating Bar */}
        <Card className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900 text-white rounded-2xl border-none">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="p-2 bg-primary-600 rounded-xl text-white shadow-premium">
              <Workflow className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-100">Ready to start executing this roadmap?</h4>
              <p className="text-[10px] text-slate-400">Form the project workspace to assign tasks and send teammate requests.</p>
            </div>
          </div>
          <div className="flex space-x-2.5 shrink-0">
            <button
              onClick={() => handleCreateProject('matchmaker')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Recruit Matches First
            </button>
            <button
              onClick={() => handleCreateProject('workspace')}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-all focus:outline-none"
            >
              Open Workspace & Tasks
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Render Survey Form
  const totalSteps = 8;
  const progressPercent = Math.round((step / totalSteps) * 100);

  const getStepIcon = () => {
    switch (step) {
      case 1: return <Compass className="h-5 w-5 text-primary-500" />;
      case 2: return <Sparkles className="h-5 w-5 text-primary-500" />;
      case 3: return <Layers className="h-5 w-5 text-primary-500" />;
      case 4: return <Users className="h-5 w-5 text-primary-500" />;
      case 5: return <Settings className="h-5 w-5 text-primary-500" />;
      case 6: return <FileCode2 className="h-5 w-5 text-primary-500" />;
      case 7: return <Clock className="h-5 w-5 text-primary-500" />;
      case 8: return <Users className="h-5 w-5 text-primary-500" />;
      default: return <Sparkles className="h-5 w-5 text-primary-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in-up text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">I Have an Idea 💡</h1>
        <p className="text-xs text-slate-500 mt-1">
          Have an idea but not sure how to build it? Answer these 8 simple questions. ProjectHub will draft technology structures, task charts, and find matching developers.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          <span>Question {step} of {totalSteps}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Survey Step Card */}
      <Card className="p-6 md:p-8 flex flex-col justify-between min-h-[300px]">
        {/* Step Content */}
        <div className="space-y-5">
          <div className="inline-flex p-3 bg-primary-50 rounded-2xl border border-primary-100">
            {getStepIcon()}
          </div>

          {step === 1 && (
            <div className="space-y-2 animate-fade-in">
              <h2 className="text-base font-bold text-slate-900">What is your project name?</h2>
              <p className="text-xs text-slate-400 leading-normal">Provide a short, catchy title for your workspace.</p>
              <Input
                type="text"
                placeholder="e.g. AI Healthcare Assistant"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">Describe your project idea in detail</h2>
              <p className="text-xs text-slate-400 leading-normal">Explain what you want to build and what technical capabilities it requires.</p>
              <Input
                placeholder="Describe your idea... e.g. An AI-powered app that connects smart plugs in dorm rooms to a time-series energy usage graph, warning students about heavy load spikes."
                textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                required
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">What problem does it solve?</h2>
              <p className="text-xs text-slate-400 leading-normal">Describe why this project matters and what gap it fills.</p>
              <Input
                placeholder="What problem is being solved? e.g. Students lack awareness of real-time electricity waste in dorm rooms."
                textarea
                rows={3}
                value={problemSolved}
                onChange={(e) => setProblemSolved(e.target.value)}
                autoFocus
                required
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">Who are the target users?</h2>
              <p className="text-xs text-slate-400 leading-normal">Who benefits from using your product? e.g. College students, developers, researchers.</p>
              <Input
                placeholder="e.g. University housing associations, eco-clubs, and student residents."
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value)}
                autoFocus
                required
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">Select project category</h2>
              <p className="text-xs text-slate-400 leading-normal">This determines the estimated difficulty rating and roadmap milestones scope.</p>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                options={categoryOptions}
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">Technical knowledge preference</h2>
              <p className="text-xs text-slate-400 leading-normal">Do you already have a stack in mind, or do you want our recommender engine to suggest the optimal choices?</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-left">
                <button
                  type="button"
                  onClick={() => setTechLevel('know')}
                  className={`p-4 border rounded-xl flex flex-col justify-between text-left transition-all ${
                    techLevel === 'know'
                      ? 'border-primary-600 bg-primary-50/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900">I know my technology</span>
                  <span className="text-[10px] text-slate-400 mt-2">I have specific tech libraries in mind.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTechLevel('help')}
                  className={`p-4 border rounded-xl flex flex-col justify-between text-left transition-all ${
                    techLevel === 'help'
                      ? 'border-primary-600 bg-primary-50/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900">Help me choose technology</span>
                  <span className="text-[10px] text-slate-400 mt-2">Recommend matching stacks based on keywords.</span>
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">Expected duration</h2>
              <p className="text-xs text-slate-400 leading-normal">How much calendar time do you expect to invest in completing this?</p>
              <Select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                options={durationOptions}
              />
            </div>
          )}

          {step === 8 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">Target team size</h2>
              <p className="text-xs text-slate-400 leading-normal">How many teammates are needed (excluding yourself)?</p>
              <Select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                options={teamSizeOptions}
              />
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-6">
          <Button
            variant="ghost"
            disabled={step === 1}
            onClick={() => setStep(prev => prev - 1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="font-semibold text-slate-500"
          >
            Previous
          </Button>

          {step === totalSteps ? (
            <Button
              onClick={handleStartAnalysis}
              variant="primary"
              rightIcon={<Sparkles className="h-4 w-4" />}
              className="font-semibold"
            >
              Analyze My Idea
            </Button>
          ) : (
            <Button
              onClick={() => setStep(prev => prev + 1)}
              variant="primary"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="font-semibold"
            >
              Next Question
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
export default IdeaWizard;
