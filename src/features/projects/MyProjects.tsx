import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Workspace } from './Workspace';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { ProgressBar } from '../../components/ProgressBar';
import { 
  Sparkles, 
  Clock, 
  Users, 
  FolderLock, 
  Calendar,
  CheckCircle,
  FileCode2,
  Workflow
} from 'lucide-react';

export const MyProjects: React.FC = () => {
  const { currentUser, projects, students } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'Active' | 'Planning' | 'Completed' | 'Archived'>('Active');

  if (!currentUser) return null;

  const projectId = searchParams.get('id');

  // If query string contains ?id=..., mount the project Workspace
  if (projectId) {
    return (
      <Workspace 
        projectId={projectId} 
        onBack={() => {
          setSearchParams({});
        }} 
      />
    );
  }

  // Filter projects user is participating in (either creator or member)
  const myProjects = projects.filter(p => 
    p.creatorId === currentUser.id || 
    p.members.some(m => m.studentId === currentUser.id && m.status === 'Joined')
  );

  const filteredProjects = myProjects.filter(p => p.status === activeTab);

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'Active', label: 'Active Sprints' },
    { id: 'Planning', label: 'In Planning' },
    { id: 'Completed', label: 'Completed Portfolio' },
    { id: 'Archived', label: 'Archived Files' }
  ];

  return (
    <div className="space-y-6 fade-in-up text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Manage roadmap schedules, Kanban sprint boards, files uploads, and teammate chats.</p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => navigate('/idea/wizard')}
          leftIcon={<Sparkles className="h-4 w-4" />}
        >
          I Have an Idea
        </Button>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 font-medium text-sm border-b-2 transition-colors focus:outline-none flex items-center space-x-2 ${
                activeTab === t.id
                  ? 'border-primary-600 text-primary-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{t.label}</span>
              <Badge 
                variant={activeTab === t.id ? 'primary' : 'neutral'} 
                size="sm" 
                className="ml-1.5"
              >
                {myProjects.filter(p => p.status === t.id).length}
              </Badge>
            </button>
          ))}
        </nav>
      </div>

      {/* Projects Cards Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-200">
          <FolderLock className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">
            No projects in {activeTab}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-5">
            {activeTab === 'Active' && 'You do not have any active construction sprints. Start an idea draft or join a matching project.'}
            {activeTab === 'Planning' && 'None of your ideas are in the initial recruitment or planning phase.'}
            {activeTab === 'Completed' && 'Finish backlog tasks in your workspace to publish showcases here!'}
            {activeTab === 'Archived' && 'Your archived logs are currently empty.'}
          </p>
          <Button size="sm" onClick={() => navigate('/idea/wizard')}>
            Draft Project Idea
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(project => {
            const activeMilestones = project.roadmap.filter(m => m.status === 'In Progress');
            const nextTask = project.tasks.find(t => t.status === 'TODO' && (t.assigneeId === currentUser.id || !t.assigneeId));
            
            // Retrieve teammate profile avatars
            const joinedMembers = project.members.filter(m => m.status === 'Joined').map(m => {
              const profile = students.find(s => s.id === m.studentId);
              return {
                name: profile?.name || 'Anonymous',
                avatar: profile?.avatarUrl
              };
            });

            return (
              <Card 
                key={project.id} 
                hoverable 
                className="flex flex-col justify-between cursor-pointer border-slate-100 hover:border-slate-200 text-left transition-all"
                onClick={() => setSearchParams({ id: project.id })}
              >
                <div className="space-y-4">
                  
                  {/* Category + Status pill */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {project.category}
                    </span>
                    <Badge variant={project.status === 'Completed' ? 'success' : 'primary'} size="sm">
                      {project.status}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{project.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed truncate-2-lines">{project.description}</p>
                  </div>

                  {/* Progress bar */}
                  <ProgressBar value={project.progress} showLabel size="sm" />

                  {/* Milestone status indicator */}
                  {activeMilestones.length > 0 ? (
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Clock className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                      <span className="truncate">Current: <span className="font-semibold text-slate-700">{activeMilestones[0].name}</span></span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 bg-slate-50/50 px-2.5 py-1 rounded-lg border border-dashed border-slate-100">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>No active milestones pending check off</span>
                    </div>
                  )}

                </div>

                {/* Card Footer: Avatars + Deadlines */}
                <div className="border-t border-slate-50 mt-5 pt-4 flex justify-between items-center shrink-0">
                  
                  {/* Teammates stack */}
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {joinedMembers.map((member, i) => (
                      <Avatar 
                        key={i} 
                        name={member.name} 
                        src={member.avatar} 
                        size="xs" 
                        className="ring-2 ring-white" 
                      />
                    ))}
                    {joinedMembers.length === 0 && (
                      <span className="text-[10px] text-slate-400">Only you</span>
                    )}
                  </div>

                  {/* Duration meta */}
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>Duration: {project.duration}</span>
                  </div>

                </div>

              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};
export default MyProjects;
