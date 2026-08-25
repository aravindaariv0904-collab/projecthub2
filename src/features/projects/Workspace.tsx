import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { ProgressBar } from '../../components/ProgressBar';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { 
  Sparkles, 
  Grid, 
  Layers, 
  MessageSquare, 
  FolderOpen, 
  Users, 
  GitBranch, 
  Trophy, 
  CheckSquare, 
  Plus, 
  Calendar, 
  ArrowRight,
  MoreVertical,
  ChevronRight,
  Send,
  Upload,
  Info,
  Link2,
  Trash2,
  Edit2
} from 'lucide-react';
import { Project, Task, Milestone, ProjectFile, ChatMessage, TeamMember, Student } from '../../types';

interface WorkspaceProps {
  projectId: string;
  onBack: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ projectId, onBack }) => {
  const { 
    currentUser, 
    projects, 
    students, 
    applications,
    updateProject, 
    addTask, 
    updateTask, 
    deleteTask, 
    addProjectFile, 
    sendProjectChatMessage, 
    publishShowcase,
    acceptProjectApplication,
    rejectProjectApplication
  } = useApp();
  
  const navigate = useNavigate();
  
  // Local UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'milestones' | 'chat' | 'files' | 'github' | 'showcase' | 'applications'>('overview');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Task Modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [taskStatus, setTaskStatus] = useState<'TODO' | 'In Progress' | 'Review' | 'Done'>('TODO');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskLabel, setTaskLabel] = useState('');

  // File upload simulated state
  const [fileCategory, setFileCategory] = useState<'Document' | 'Image' | 'Design' | 'Resource'>('Document');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  // Chat message local input
  const [chatInput, setChatInput] = useState('');

  // GitHub connection simulated state
  const [gitRepoNameInput, setGitRepoNameInput] = useState('');
  const [isConnectingGit, setIsConnectingGit] = useState(false);

  // Showcase form state
  const [showcaseProblem, setShowcaseProblem] = useState('');
  const [showcaseSolution, setShowcaseSolution] = useState('');
  const [showcaseScreenshot, setShowcaseScreenshot] = useState('');
  const [showcaseDemo, setShowcaseDemo] = useState('');
  const [showcaseRepo, setShowcaseRepo] = useState('');
  const [showcaseAch, setShowcaseAch] = useState('');

  const project = projects.find(p => p.id === projectId);
  if (!currentUser || !project) return null;

  // Retrieve project members profiles
  const projectMembers = project.members.map(m => {
    const student = students.find(s => s.id === m.studentId);
    return {
      ...m,
      student
    };
  });

  // Calculate task statistics
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = project.tasks.filter(t => t.status === 'In Progress').length;
  const reviewTasks = project.tasks.filter(t => t.status === 'Review').length;

  const handleOpenTaskModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTaskTitle(task.title);
      setTaskDesc(task.description);
      setTaskAssignee(task.assigneeId || '');
      setTaskPriority(task.priority);
      setTaskStatus(task.status);
      setTaskDeadline(task.deadline);
      setTaskLabel(task.labels.join(', '));
    } else {
      setEditingTask(null);
      setTaskTitle('');
      setTaskDesc('');
      setTaskAssignee('');
      setTaskPriority('Medium');
      setTaskStatus('TODO');
      setTaskDeadline('Week 1');
      setTaskLabel('Engineering');
    }
    setTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    if (editingTask) {
      // Modify existing
      const modified: Task = {
        ...editingTask,
        title: taskTitle,
        description: taskDesc,
        assigneeId: taskAssignee || null,
        priority: taskPriority,
        status: taskStatus,
        deadline: taskDeadline,
        labels: taskLabel.split(',').map(l => l.trim()).filter(Boolean)
      };
      updateTask(project.id, modified);
      setToastMsg('Task updated successfully.');
      setToastType('success');
    } else {
      // Create new
      const created: Task = {
        id: `task-${Math.random().toString(36).substr(2, 9)}`,
        title: taskTitle,
        description: taskDesc,
        assigneeId: taskAssignee || null,
        priority: taskPriority,
        status: taskStatus,
        deadline: taskDeadline,
        labels: taskLabel.split(',').map(l => l.trim()).filter(Boolean)
      };
      addTask(project.id, created);
      setToastMsg('Task added to backlog.');
      setToastType('success');
    }
    setTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(project.id, taskId);
    setToastMsg('Task deleted.');
    setToastType('error');
  };

  const handleMoveTaskStatus = (task: Task, newStatus: any) => {
    updateTask(project.id, { ...task, status: newStatus });
  };

  const handleToggleMilestone = (milestone: Milestone) => {
    const updatedStatus: 'TODO' | 'Completed' = milestone.status === 'Completed' ? 'TODO' : 'Completed';
    const updatedRoadmap = project.roadmap.map(m => 
      m.id === milestone.id ? { ...m, status: updatedStatus } : m
    );
    updateProject({ ...project, roadmap: updatedRoadmap });
    setToastMsg(`Milestone marked as ${updatedStatus.toLowerCase()}.`);
    setToastType('success');
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendProjectChatMessage(project.id, chatInput);
    setChatInput('');
  };

  const handleSimulateFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    const newFile: ProjectFile = {
      id: `file-${Math.random().toString(36).substr(2, 9)}`,
      name: fileName,
      size: fileSize || '1.5 MB',
      category: fileCategory,
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString().split('T')[0],
      url: '#'
    };
    addProjectFile(project.id, newFile);
    setFileName('');
    setFileSize('');
    setToastMsg('File added to resources.');
    setToastType('success');
  };

  const handleConnectGit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitRepoNameInput.trim()) return;

    setIsConnectingGit(true);
    setTimeout(() => {
      updateProject({
        ...project,
        githubConnected: true,
        githubRepoName: gitRepoNameInput
      });
      setIsConnectingGit(false);
      setToastMsg('GitHub Repository Connected!');
      setToastType('success');
    }, 1200);
  };

  const handlePublishShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseProblem || !showcaseSolution) {
      alert('Please explain the problem and solution to publish the showcase.');
      return;
    }

    publishShowcase(project.id, {
      problemSolved: showcaseProblem,
      solution: showcaseSolution,
      screenshots: [
        showcaseScreenshot || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600'
      ],
      liveDemoUrl: showcaseDemo || undefined,
      githubUrl: showcaseRepo || undefined,
      achievements: showcaseAch ? showcaseAch.split(',').map(a => a.trim()).filter(Boolean) : [],
      completionDate: new Date().toISOString().split('T')[0],
      published: true
    });

    setToastMsg('Congratulations! Your project showcase is published to your profile.');
    setToastType('success');
    setActiveTab('overview');
  };

  const priorityColors = {
    Low: 'bg-slate-50 text-slate-600',
    Medium: 'bg-blue-50 text-blue-700',
    High: 'bg-red-50 text-red-700'
  };

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    ...projectMembers
      .filter(m => m.status === 'Joined' && m.student)
      .map(m => ({ value: m.studentId, label: m.student!.name }))
  ];

  const statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Review', label: 'Review' },
    { value: 'Done', label: 'Done' }
  ];

  const pendingAppsCount = applications.filter(a => a.projectId === project.id && a.status === 'Pending').length;

  return (
    <div className="space-y-6 fade-in-up text-left">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <button 
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 font-semibold mb-2"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span>Back to projects index</span>
          </button>
          
          <div className="flex items-center space-x-3 text-left">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{project.category}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <Badge variant={project.status === 'Completed' ? 'success' : 'primary'} size="sm">
              {project.status}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{project.name}</h1>
        </div>

        {/* Action button trigger */}
        <div className="flex space-x-2 shrink-0">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setActiveTab('chat')}
            leftIcon={<MessageSquare className="h-4 w-4" />}
            className="text-slate-500 hover:text-slate-950"
          >
            Chat Room
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate(`/team-builder?projectId=${project.id}`)}
            leftIcon={<Users className="h-4 w-4" />}
          >
            Recruit Teammates
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => handleOpenTaskModal()}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Tabs navigation panel */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <Grid className="h-4 w-4" /> },
            { id: 'tasks', label: 'Tasks Board', icon: <CheckSquare className="h-4 w-4" />, count: project.tasks.length },
            { id: 'milestones', label: 'Milestones', icon: <Layers className="h-4 w-4" /> },
            { id: 'chat', label: 'Team Chat', icon: <MessageSquare className="h-4 w-4" /> },
            { id: 'files', label: 'Resources Cabinet', icon: <FolderOpen className="h-4 w-4" /> },
            { id: 'github', label: 'GitHub Link', icon: <GitBranch className="h-4 w-4" /> },
            { id: 'showcase', label: 'Showcase Portfolio', icon: <Trophy className="h-4 w-4" /> },
            ...(project.creatorId === currentUser.id ? [
              { id: 'applications', label: 'Applications', icon: <Users className="h-4 w-4" />, count: pendingAppsCount }
            ] : [])
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 font-medium text-sm border-b-2 transition-colors focus:outline-none flex items-center space-x-2 shrink-0 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Workspace Active Views */}
      <div className="space-y-6">

        {/* 1. OVERVIEW VIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            
            {/* Details panel */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Description</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">{project.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Statement</h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{project.problemSolved}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Users</h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{project.targetUsers}</p>
                  </div>
                </div>
              </Card>

              {/* Technologies */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technology Configurations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.technologies.map(tech => (
                    <Card key={tech.name} className="p-4 border-slate-100 flex items-start space-x-3 shadow-premium">
                      <div className="p-2 bg-primary-50 rounded-lg text-primary-600 shrink-0">
                        <FolderOpen className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-800">{tech.name}</h4>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded">{tech.category}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{tech.why}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Roster & Stats */}
            <div className="space-y-6">
              
              {/* Progress dial card */}
              <Card className="text-center relative">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left mb-3">Overall Progress Metrics</span>
                <ProgressBar value={project.progress} showLabel size="md" className="mb-4" />
                <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-4 text-center">
                  <div>
                    <span className="text-base font-extrabold text-slate-800">{totalTasks}</span>
                    <span className="text-[9px] text-slate-400 block font-semibold">Total</span>
                  </div>
                  <div>
                    <span className="text-base font-extrabold text-blue-600">{inProgressTasks + reviewTasks}</span>
                    <span className="text-[9px] text-slate-400 block font-semibold">Pending</span>
                  </div>
                  <div>
                    <span className="text-base font-extrabold text-emerald-600">{completedTasks}</span>
                    <span className="text-[9px] text-slate-400 block font-semibold">Completed</span>
                  </div>
                </div>
              </Card>

              {/* Members Team roster */}
              <Card className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Roster ({project.members.filter(m => m.status === 'Joined').length})</h3>
                  <button 
                    onClick={() => navigate(`/team-builder?projectId=${project.id}`)}
                    className="text-[10px] text-primary-600 hover:underline font-semibold"
                  >
                    Add Teammates
                  </button>
                </div>
                
                <div className="space-y-3">
                  {projectMembers.map(member => (
                    <div key={member.studentId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <Avatar name={member.student?.name || 'Anonymous'} src={member.student?.avatarUrl} size="sm" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{member.student?.name || 'Anonymous'}</h4>
                          <span className="text-[9px] text-slate-400">{member.role}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={member.status === 'Joined' ? 'success' : member.status === 'Pending' ? 'warning' : 'danger'} 
                        size="sm"
                      >
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          </div>
        )}

        {/* 2. TASKS / BOARD VIEW */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            
            {/* Columns loop */}
            {(['TODO', 'In Progress', 'Review', 'Done'] as const).map(column => {
              const columnTasks = project.tasks.filter(t => t.status === column);
              
              return (
                <div key={column} className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col min-h-[500px]">
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{column === 'TODO' ? 'Backlog' : column}</h3>
                    </div>
                    <Badge variant="neutral" size="sm" className="bg-white border border-slate-200">
                      {columnTasks.length}
                    </Badge>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {columnTasks.length === 0 ? (
                      <div className="h-28 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-[10px]">
                        Empty Column
                      </div>
                    ) : (
                      columnTasks.map(task => {
                        const assignee = students.find(s => s.id === task.assigneeId);
                        
                        return (
                          <Card 
                            key={task.id} 
                            padded={false}
                            className="p-3.5 space-y-3 text-left shadow-premium border border-slate-100 hover:border-slate-200 transition-all select-none"
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="text-xs font-bold text-slate-800 leading-snug">{task.title}</h4>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => handleOpenTaskModal(task)}
                                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-slate-400 hover:text-red-600 p-0.5 rounded transition-colors"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-500 leading-relaxed truncate-2-lines">{task.description}</p>
                            
                            <div className="flex flex-wrap gap-1">
                              {task.labels.map(lbl => (
                                <Badge key={lbl} variant="neutral" size="sm" className="text-[8px] px-1 py-0.2 bg-slate-100 border-none">{lbl}</Badge>
                              ))}
                            </div>

                            {/* Task meta details footer */}
                            <div className="flex justify-between items-center pt-2 border-t border-slate-50 shrink-0">
                              <Badge variant="neutral" className={`text-[8px] px-1 py-0.2 ${priorityColors[task.priority]}`}>
                                {task.priority}
                              </Badge>
                              
                              <div className="flex items-center space-x-2">
                                <span className="text-[9px] text-slate-400">{task.deadline}</span>
                                <Avatar name={assignee?.name || 'Unassigned'} src={assignee?.avatarUrl} size="xs" />
                              </div>
                            </div>

                            {/* Quick status movement controls */}
                            <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-slate-50">
                              <select
                                value={task.status}
                                onChange={(e) => handleMoveTaskStatus(task, e.target.value as any)}
                                className="w-full text-[9px] font-semibold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 focus:outline-none"
                              >
                                {statusOptions.map(o => (
                                  <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                              </select>
                              <Badge variant="neutral" size="sm" className="text-[8px] justify-center px-0 font-medium">Status Selector</Badge>
                            </div>

                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* 3. MILESTONES VIEW */}
        {activeTab === 'milestones' && (
          <Card className="text-left space-y-4 max-w-3xl mx-auto">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Development Milestones</h3>
              <p className="text-xs text-slate-500 mt-1">Check off milestones as your team finishes their associated tasks to update your overall metrics.</p>
            </div>
            
            <div className="space-y-4 mt-4">
              {project.roadmap.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No roadmap milestones defined yet.
                </div>
              ) : (
                project.roadmap.map((ms, index) => {
                  const isCompleted = ms.status === 'Completed';
                  const milestoneTasks = project.tasks.filter(t => ms.tasks.includes(t.id));
                  const totalMsTasks = milestoneTasks.length;
                  const completedMsTasks = milestoneTasks.filter(t => t.status === 'Done').length;
                  const ratio = totalMsTasks > 0 ? Math.round((completedMsTasks / totalMsTasks) * 100) : 0;
                  return (
                    <div key={ms.id} className="flex items-start space-x-3.5 p-4 rounded-xl border border-slate-100 shadow-premium bg-slate-50/20">
                      <input 
                        type="checkbox" 
                        checked={isCompleted}
                        disabled
                        className="h-4.5 w-4.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-not-allowed mt-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                          <h4 className={`text-xs font-bold text-slate-900 ${isCompleted ? 'line-through text-slate-400' : ''}`}>{ms.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={isCompleted ? 'success' : 'neutral'} size="sm">
                              {ms.duration}
                            </Badge>
                            <Badge variant={isCompleted ? 'success' : ratio > 0 ? 'primary' : 'neutral'} size="sm">
                              {ms.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5">{ms.description}</p>
                        
                        {totalMsTasks > 0 && (
                          <div className="mt-2.5 flex items-center space-x-3">
                            <div className="flex-1 bg-slate-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-primary-600 h-1 rounded-full transition-all" style={{ width: `${ratio}%` }}></div>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 shrink-0">{completedMsTasks}/{totalMsTasks} Tasks ({ratio}%)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        )}

        {/* 4. CHAT VIEW */}
        {activeTab === 'chat' && (
          <Card className="max-w-2xl mx-auto flex flex-col h-[550px] p-0 text-left overflow-hidden border border-slate-100">
            {/* Header announcement toggle */}
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/50">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Team Chat Board</h4>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">Real-time collaboration updates</p>
              </div>
              <Badge variant="primary" size="sm" className="animate-pulse">Active Channel</Badge>
            </div>

            {/* Chat message listing (scrollable) */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {project.chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No chat messages yet. Type below to start the conversation!
                </div>
              ) : (
                project.chatMessages.map((msg) => {
                  const isSystem = msg.senderId === 'system';
                  
                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center select-none">
                        <div className="text-center px-4 py-2 rounded-lg bg-primary-50 border border-primary-100 text-[10px] text-primary-700 max-w-md leading-relaxed font-semibold">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  const isMe = msg.senderId === currentUser.id;

                  return (
                    <div key={msg.id} className={`flex items-start space-x-2.5 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar name={msg.senderName} src={msg.senderAvatar} size="xs" className="mt-0.5 shrink-0" />
                      
                      <div className="max-w-[70%]">
                        <div className={`flex items-center space-x-1.5 mb-1 ${isMe ? 'justify-end' : ''}`}>
                          <span className="text-[10px] font-bold text-slate-700">{msg.senderName}</span>
                          <span className="text-[8px] text-slate-400">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs leading-normal shadow-sm ${
                          isMe 
                            ? 'bg-primary-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input entry bar */}
            <form onSubmit={handleSendChatMessage} className="p-4 border-t border-slate-100 shrink-0 flex items-center space-x-3 bg-white">
              <input
                type="text"
                placeholder="Message teammate channels..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <Button type="submit" size="sm" rightIcon={<Send className="h-3.5 w-3.5" />}>
                Send
              </Button>
            </form>
          </Card>
        )}

        {/* 5. FILES VIEW */}
        {activeTab === 'files' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            
            {/* Upload form Panel */}
            <Card className="h-fit">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Simulate File Upload</h3>
              <form onSubmit={handleSimulateFileUpload} className="space-y-4">
                <Input
                  label="Document Name"
                  placeholder="e.g. database_schema.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Size Label"
                    placeholder="e.g. 1.2 MB"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                  />
                  <Select
                    label="Category"
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value as any)}
                    options={[
                      { value: 'Document', label: 'Document' },
                      { value: 'Image', label: 'Image' },
                      { value: 'Design', label: 'Design' },
                      { value: 'Resource', label: 'Resource' }
                    ]}
                  />
                </div>

                <Button type="submit" className="w-full text-xs font-semibold" leftIcon={<Upload className="h-4 w-4" />}>
                  Upload Simulated File
                </Button>
              </form>
            </Card>

            {/* Resources list Panel */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Shared Documents Roster</h3>
              
              {project.files.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-200">
                  <FolderOpen className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400">No documents uploaded to this workspace yet.</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {project.files.map(file => (
                    <Card key={file.id} className="p-4 border-slate-100 flex items-center justify-between shadow-premium hover:shadow-premium-hover transition-all">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="p-2 bg-slate-100 border text-slate-500 rounded-lg shrink-0">
                          <Link2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{file.name}</h4>
                          <span className="text-[9px] text-slate-400 block font-medium mt-0.5">
                            Uploaded by {file.uploadedBy} on {file.uploadedAt} • Size: {file.size}
                          </span>
                        </div>
                      </div>
                      <Badge variant="neutral" size="sm" className="shrink-0">{file.category}</Badge>
                    </Card>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 6. GITHUB VIEW */}
        {activeTab === 'github' && (
          <div className="max-w-2xl mx-auto space-y-6 text-left">
            
            {!project.githubConnected ? (
              <Card className="text-center p-8 space-y-4">
                <GitBranch className="h-10 w-10 text-slate-300 mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-slate-700">Link GitHub Repository</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mt-1">
                    Connect your team repository. This tracks commits and pull request history inside this dashboard.
                  </p>
                </div>
                
                <form onSubmit={handleConnectGit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. college-hackers/study-assistant"
                    value={gitRepoNameInput}
                    onChange={(e) => setGitRepoNameInput(e.target.value)}
                    className="w-full sm:flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                  <Button type="submit" size="sm" className="w-full sm:w-auto font-semibold shrink-0" isLoading={isConnectingGit}>
                    Connect Repository
                  </Button>
                </form>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Connection Status card */}
                <Card className="p-4 flex items-center justify-between border-emerald-100 bg-emerald-50/10">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100 shrink-0">
                      <GitBranch className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">Connected Repository</h4>
                      <a href="#" className="text-[10px] text-primary-600 font-semibold hover:underline truncate block mt-0.5">
                        github.com/{project.githubRepoName}
                      </a>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    onClick={() => updateProject({ ...project, githubConnected: false, githubRepoName: '' })}
                  >
                    Disconnect
                  </Button>
                </Card>

                {/* Simulated commits list */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Simulated Repository Sprints Activity</h3>
                  
                  <div className="space-y-2">
                    {[
                      { commit: 'feat: quantize Phi-3 weights loop locally', author: 'Elena Rostova', time: '10 hours ago', sha: 'a7b8c9d' },
                      { commit: 'fix: patch SQLite cursor crash on empty categories', author: 'Marcus Johnson', time: '1 day ago', sha: 'c2d3e4f' },
                      { commit: 'docs: draft architecture requirements PDF', author: 'Alex Rivera', time: '2 days ago', sha: 'e5f6g7h' }
                    ].map(activity => (
                      <Card key={activity.sha} className="p-3 border-slate-100 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                        <div className="text-left min-w-0 pr-4">
                          <p className="text-xs font-semibold text-slate-800 truncate leading-snug">{activity.commit}</p>
                          <span className="text-[9px] text-slate-400 block font-medium mt-1">
                            Authored by <span className="font-semibold text-slate-600">{activity.author}</span> • {activity.time}
                          </span>
                        </div>
                        <Badge variant="neutral" size="sm" className="font-mono text-[9px] uppercase tracking-wide shrink-0">
                          {activity.sha}
                        </Badge>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 7. SHOWCASE PORTFOLIO VIEW */}
        {activeTab === 'showcase' && (
          <div className="max-w-2xl mx-auto space-y-6 text-left">
            
            {project.status === 'Completed' && project.showcase ? (
              <Card className="space-y-5">
                <div className="flex justify-between items-start border-b border-slate-50 pb-3 shrink-0">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">PROJECT PORTFOLIO</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">Published Showcase</h3>
                  </div>
                  <Badge variant="success" size="sm">Completed Showcase</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">The Challenge Addressed</h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{project.showcase.problemSolved}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">The Solution Developed</h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{project.showcase.solution}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {project.showcase.liveDemoUrl && (
                      <a href={project.showcase.liveDemoUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 p-2.5 bg-slate-50 border rounded-lg hover:bg-slate-100 transition-colors">
                        <Link2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 truncate">Live Sandbox Demo</span>
                      </a>
                    )}
                    {project.showcase.githubUrl && (
                      <a href={project.showcase.githubUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 p-2.5 bg-slate-50 border rounded-lg hover:bg-slate-100 transition-colors">
                        <GitBranch className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 truncate">GitHub Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 md:p-8 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Publish Project Showcase</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Complete your project roadmap and compile a visual portfolio cards detailing technical contributions. This populates your reputation showcase profile!
                  </p>
                </div>

                {project.progress < 100 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start space-x-2.5">
                    <Info className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                      Your project progress stands at <span className="font-bold">{project.progress}%</span>. You can still publish drafts, but completing 100% of backlog tasks yields greater collaboration score multipliers (+3 overall standing marks).
                    </p>
                  </div>
                )}

                <form onSubmit={handlePublishShowcase} className="space-y-4 pt-2">
                  <Input
                    label="The Challenge (Detail problem)"
                    placeholder="Describe what specific student workflow was broken..."
                    textarea
                    rows={3}
                    value={showcaseProblem}
                    onChange={(e) => setShowcaseProblem(e.target.value)}
                    required
                  />

                  <Input
                    label="The Solution (Detail implementation)"
                    placeholder="Describe how your technologies choice and roadmap sprint addressed this..."
                    textarea
                    rows={3}
                    value={showcaseSolution}
                    onChange={(e) => setShowcaseSolution(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Screenshots Image URL"
                      placeholder="https://unsplash.com/..."
                      value={showcaseScreenshot}
                      onChange={(e) => setShowcaseScreenshot(e.target.value)}
                    />
                    <Input
                      label="Live Demo Link"
                      placeholder="e.g. Vercel deployment link"
                      value={showcaseDemo}
                      onChange={(e) => setShowcaseDemo(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="GitHub Repo Link"
                      placeholder="https://github.com/..."
                      value={showcaseRepo}
                      onChange={(e) => setShowcaseRepo(e.target.value)}
                    />
                    <Input
                      label="Key Achievements (Comma separated)"
                      placeholder="e.g. CalHacks Best API, quantized local runtime"
                      value={showcaseAch}
                      onChange={(e) => setShowcaseAch(e.target.value)}
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full font-semibold" leftIcon={<Trophy className="h-4.5 w-4.5" />}>
                    Publish Showcase & Close Project Sprints
                  </Button>
                </form>
              </Card>
            )}

          </div>
        )}

        {/* 8. APPLICATIONS VIEW (Only visible to owner) */}
        {activeTab === 'applications' && project.creatorId === currentUser.id && (
          <div className="space-y-6 text-left">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-1">Pending Project Applications</h3>
              <p className="text-xs text-slate-400 mb-6">Review student recruitment submissions for vacant team roles.</p>
              
              {applications.filter(a => a.projectId === project.id && a.status === 'Pending').length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No pending applications. Use the "Recruit Teammates" feature to find and invite potential candidates.
                </div>
              ) : (
                <div className="space-y-4">
                  {applications
                    .filter(a => a.projectId === project.id && a.status === 'Pending')
                    .map(app => {
                      const student = students.find(s => s.id === app.studentId);
                      return (
                        <div key={app.id} className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-sm">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <Avatar name={student?.name || 'Applicant'} src={student?.avatarUrl} size="sm" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 leading-snug">{student?.name || 'Anonymous'}</h4>
                                <span className="text-[10px] text-slate-500">{student?.course} • {student?.college}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider block">Applying for Position</span>
                              <Badge variant="primary" size="sm" className="text-[9px] font-semibold">{app.roleName}</Badge>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider block">Pitch</span>
                              <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">"{app.pitch}"</p>
                            </div>
                            {app.skills && (
                              <div className="space-y-1">
                                <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider block">Skills Offered</span>
                                <p className="text-[10px] text-slate-600 font-semibold">{app.skills}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex sm:flex-row md:flex-col gap-2 shrink-0 md:self-center">
                            <button
                              onClick={() => {
                                acceptProjectApplication(app.id);
                                setToastMsg(`Approved ${student?.name}'s application to join the team!`);
                                setToastType('success');
                              }}
                              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors animate-fade-in"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                rejectProjectApplication(app.id);
                                setToastMsg(`Ignored application.`);
                                setToastType('error');
                              }}
                              className="px-4 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                              Ignore
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </Card>
          </div>
        )}

      </div>

      {/* Reusable Task Management Modal */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title={editingTask ? 'Edit Task Parameters' : 'Create New Backlog Task'}
        footer={
          <>
            <button
              onClick={() => setTaskModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold border rounded-lg transition-colors bg-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTask}
              className="px-4 py-1.5 text-xs text-white bg-primary-600 hover:bg-primary-700 font-semibold rounded-lg shadow-sm transition-colors"
            >
              Save Task
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveTask} className="space-y-4 text-left">
          <Input
            label="Task Name"
            placeholder="e.g. Build SQLite schemas connection loops"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Detail Description"
            placeholder="Describe what specific constraints need testing or building..."
            textarea
            rows={3}
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assignee"
              value={taskAssignee}
              onChange={(e) => setTaskAssignee(e.target.value)}
              options={assigneeOptions}
            />
            <Select
              label="Priority Level"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as any)}
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Column Status"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value as any)}
              options={statusOptions}
            />
            <Input
              label="Timeline / Deadline"
              placeholder="e.g. Week 2 or 2026-09-12"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
            />
          </div>

          <Input
            label="Labels (Comma separated)"
            placeholder="e.g. Backend, SQLite, Testing"
            value={taskLabel}
            onChange={(e) => setTaskLabel(e.target.value)}
          />
        </form>
      </Modal>

      {/* Floating Toast notifications */}
      {toastMsg && (
        <Toast 
          message={toastMsg} 
          type={toastType} 
          onClose={() => setToastMsg('')} 
        />
      )}

    </div>
  );
};

// Local arrow left icon implementation to avoid duplicate imports
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={props.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);
