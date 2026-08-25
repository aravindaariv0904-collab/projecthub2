import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Toast } from '../../components/Toast';
import { 
  Sparkles, 
  HelpCircle, 
  UserCheck, 
  Check, 
  X, 
  Bookmark, 
  UserX,
  Lock,
  Eye,
  Shield,
  Send,
  Info
} from 'lucide-react';
import { Student, Project } from '../../types';

export const TeamBuilder: React.FC = () => {
  const { 
    currentUser, 
    students, 
    projects, 
    connections, 
    sendConnectionRequest, 
    sendProjectInvitation,
    acceptConnectionRequest,
    rejectConnectionRequest
  } = useApp();
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Selected project to calculate match scores for
  const myCreatedProjects = projects.filter(p => p.creatorId === currentUser?.id);
  const initialProjId = searchParams.get('projectId') || (myCreatedProjects.length > 0 ? myCreatedProjects[0].id : '');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjId);

  // Active view: 'double-blind' or 'connections'
  const [activeTab, setActiveTab] = useState<'double-blind' | 'connections'>('double-blind');

  // Shortlisted student IDs (local state)
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [passedIds, setPassedIds] = useState<string[]>([]);
  
  // Toast notifications
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  if (!currentUser) return null;

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Calculate matching details between a project and a candidate student
  const calculateMatch = (project: Project | undefined, student: Student) => {
    if (!project) {
      // Default baseline match if no project is selected
      const interestOverlap = student.interests.filter(i => currentUser.interests.includes(i)).length;
      const baseScore = 70 + (interestOverlap * 5) + Math.round((student.collaborationScore - 90) / 2);
      return {
        score: Math.min(99, Math.max(50, baseScore)),
        why: 'Recommended based on shared interests: ' + student.interests.filter(i => currentUser.interests.includes(i)).join(', ') || 'general college matching.'
      };
    }

    // Matching project requirements
    const userSkills = student.skills.map(s => s.name.toLowerCase());
    const projectSkills = project.requiredSkills.map(s => s.name.toLowerCase());
    
    // 1. Core Skill Match
    const matchingSkills = student.skills.filter(s => projectSkills.includes(s.name.toLowerCase()));
    const skillScore = matchingSkills.length * 10;

    // 2. Availability & Collaboration Score weighting
    const repWeight = Math.round((student.collaborationScore - 90) / 2);

    // 3. Categories / Interest match
    const interestOverlap = student.interests.some(i => project.description.toLowerCase().includes(i.toLowerCase()));

    const totalScore = 65 + skillScore + repWeight + (interestOverlap ? 10 : 0);
    const finalScore = Math.min(98, Math.max(45, totalScore));

    const checkList = [];
    if (matchingSkills.length > 0) checkList.push(`✓ Has skills: ${matchingSkills.map(s => s.name).join(', ')}`);
    if (student.collaborationScore >= 92) checkList.push('✓ High Collaboration Score');
    if (interestOverlap) checkList.push('✓ Aligned interests');
    checkList.push('✓ Available for collaboration');

    return {
      score: finalScore,
      why: checkList.join(' • ')
    };
  };

  const handleConnect = (studentId: string, name: string) => {
    sendConnectionRequest(studentId);
    setToastMsg(`Connection handshake sent to ${activeTab === 'double-blind' ? 'Anonymous Builder' : name}!`);
    setToastType('success');
  };

  const handleInvite = (studentId: string, roleName: string, studentName: string) => {
    if (!selectedProjectId) return;
    sendProjectInvitation(studentId, selectedProjectId, roleName);
    setToastMsg(`Invited ${studentName} to join as ${roleName}!`);
    setToastType('success');
  };

  const toggleShortlist = (studentId: string) => {
    setShortlistedIds(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handlePass = (studentId: string) => {
    setPassedIds(prev => [...prev, studentId]);
  };
  const getConnectionStatus = (studentId: string) => {
    const conn = connections.find(c => 
      (c.senderId === currentUser.id && c.receiverId === studentId) ||
      (c.senderId === studentId && c.receiverId === currentUser.id)
    );
    return conn ? conn.status : null;
  };

  const getConnectionRole = (studentId: string) => {
    const conn = connections.find(c => 
      (c.senderId === currentUser.id && c.receiverId === studentId) ||
      (c.senderId === studentId && c.receiverId === currentUser.id)
    );
    if (!conn) return null;
    return conn.senderId === currentUser.id ? 'outgoing' : 'incoming';
  };

  const getCandidates = () => {
    return students.filter(student => {
      if (student.id === currentUser.id) return false;
      const status = getConnectionStatus(student.id);
      if (activeTab === 'double-blind') {
        return status !== 'Connected' && !passedIds.includes(student.id);
      } else {
        return status === 'Connected';
      }
    });
  };
  const candidates = getCandidates();

  return (
    <div className="space-y-6 fade-in-up text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Builder</h1>
          <p className="text-xs text-slate-500 mt-1">Discover, shortlists and invite students to your project teams.</p>
        </div>
        
        {/* Project Selector dropdown */}
        {myCreatedProjects.length > 0 && (
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recruiting For:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {myCreatedProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs selection */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('double-blind')}
            className={`pb-3 font-medium text-sm border-b-2 transition-colors focus:outline-none flex items-center space-x-2 ${
              activeTab === 'double-blind'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Double-Blind Discovery</span>
            <Badge variant="neutral" size="sm" className="ml-1 bg-slate-100">{students.filter(s => s.id !== currentUser.id && getConnectionStatus(s.id) !== 'Connected' && !passedIds.includes(s.id)).length}</Badge>
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`pb-3 font-medium text-sm border-b-2 transition-colors focus:outline-none flex items-center space-x-2 ${
              activeTab === 'connections'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>My Network (Revealed)</span>
            <Badge variant="neutral" size="sm" className="ml-1 bg-slate-100">{connections.filter(c => c.status === 'Connected').length}</Badge>
          </button>
        </nav>
      </div>

      {/* Double Blind Mode Alert */}
      {activeTab === 'double-blind' && (
        <Card className="bg-primary-50/20 border-primary-100 py-3 px-4 flex items-center space-x-3 text-left">
          <Lock className="h-5 w-5 text-primary-500 shrink-0" />
          <div className="text-xs text-slate-600 leading-normal">
            <span className="font-semibold text-slate-900">Stealth Mode Active:</span> Profiles are anonymized to eliminate bias. Names, photos, and colleges are hidden. Accept connection requests to reveal identities.
          </div>
        </Card>
      )}

      {/* Candidates List Grid */}
      {candidates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-200">
          <UserX className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">
            {activeTab === 'double-blind' ? 'No New Candidates Available' : 'Your Network is Empty'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            {activeTab === 'double-blind' 
              ? 'Try updating your project requirements or check back later for new student signups.'
              : 'Discover and connect with students anonymously in the Discovery feed to build your network.'}
          </p>
          {activeTab === 'connections' && (
            <Button size="sm" onClick={() => setActiveTab('double-blind')}>
              Open Discovery Feed
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map(student => {
            const match = calculateMatch(selectedProject, student);
            const connStatus = getConnectionStatus(student.id);
            const isShortlisted = shortlistedIds.includes(student.id);

            return (
              <Card 
                key={student.id} 
                hoverable 
                className="flex flex-col justify-between border-slate-100 text-left relative"
              >
                {/* Top card block */}
                <div className="space-y-4">
                  
                  {/* Header: Score + Bookmark */}
                  <div className="flex justify-between items-center">
                    <Badge variant={match.score >= 90 ? 'primary' : 'neutral'} size="sm">
                      <Sparkles className="h-3.5 w-3.5 mr-1 inline" />
                      {match.score}% Match
                    </Badge>
                    <div className="flex space-x-1.5">
                      <button 
                        onClick={() => toggleShortlist(student.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isShortlisted 
                            ? 'bg-primary-50 border-primary-200 text-primary-600' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      {activeTab === 'double-blind' && (
                        <button 
                          onClick={() => handlePass(student.id)}
                          className="p-1.5 rounded-lg border bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Profile: Avatar + Identity (Hidden / Shown) */}
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      name={activeTab === 'double-blind' ? 'Anonymous Builder' : student.name} 
                      src={activeTab === 'double-blind' ? undefined : student.avatarUrl} 
                      score={student.collaborationScore}
                      size="md" 
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate leading-snug">
                        {activeTab === 'double-blind' ? 'Anonymous Builder' : student.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 leading-none mt-1 truncate font-medium">
                        {student.course} • {activeTab === 'double-blind' ? 'Hidden College' : student.college}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-500 leading-relaxed h-12 overflow-hidden">
                    {activeTab === 'double-blind' 
                      ? 'Student dev specializing in technical integration, writing clean code, and working on collaborative workflows.'
                      : student.bio}
                  </p>

                  {/* Skills Grid */}
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">Technical Competencies</span>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.map(s => (
                        <Badge key={s.name} variant="neutral" size="sm" className="text-[9px] px-1.5 bg-slate-50">{s.name}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Why match info */}
                  <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] text-slate-500 flex items-start space-x-1.5 text-left border border-slate-100">
                    <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{match.why}</span>
                  </div>

                </div>

                {/* Bottom Actions Block */}
                <div className="border-t border-slate-100 mt-5 pt-4 flex space-x-2 shrink-0">
                  {activeTab === 'double-blind' ? (
                    connStatus === 'Pending' ? (
                      getConnectionRole(student.id) === 'outgoing' ? (
                        <Button variant="secondary" className="w-full text-xs font-semibold" disabled>
                          Request Sent
                        </Button>
                      ) : (
                        <div className="flex space-x-2 w-full">
                          <button
                            onClick={() => {
                              acceptConnectionRequest(student.id);
                              setToastMsg(`Handshake accepted! You are now connected.`);
                              setToastType('success');
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              rejectConnectionRequest(student.id);
                              setToastMsg(`Handshake ignored.`);
                              setToastType('error');
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                          >
                            Ignore
                          </button>
                        </div>
                      )
                    ) : connStatus === 'Rejected' ? (
                      <Button 
                        onClick={() => handleConnect(student.id, student.name)}
                        variant="primary" 
                        className="w-full text-xs font-semibold"
                        leftIcon={<Send className="h-3.5 w-3.5" />}
                      >
                        Send Connection Request
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleConnect(student.id, student.name)}
                        variant="primary" 
                        className="w-full text-xs font-semibold"
                        leftIcon={<Send className="h-3.5 w-3.5" />}
                      >
                        Send Connection Request
                      </Button>
                    )
                  ) : (
                    // Connection revealed mode: show Invite dropdown triggers
                    selectedProject ? (
                      <div className="w-full space-y-2">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">Recruit to Project role:</span>
                        <div className="flex flex-col space-y-1">
                          {selectedProject.suggestedRoles.map(role => {
                            const isPendingOrJoined = selectedProject.members.some(m => m.studentId === student.id);
                            return (
                              <button
                                key={role.name}
                                disabled={isPendingOrJoined}
                                onClick={() => handleInvite(student.id, role.name, student.name)}
                                className={`w-full flex justify-between items-center px-3 py-1.5 text-[11px] font-semibold border rounded-lg transition-colors text-left ${
                                  isPendingOrJoined 
                                    ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600'
                                }`}
                              >
                                <span>{role.name}</span>
                                <span className="text-[9px] font-normal text-slate-400">
                                  {isPendingOrJoined ? 'Recruited' : `${role.filled}/${role.count} slots`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <Button variant="secondary" className="w-full text-xs font-semibold" disabled>
                        Select a recruiting project
                      </Button>
                    )
                  )}
                </div>

              </Card>
            );
          })}
        </div>
      )}

      {/* Floating Toast Notification */}
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
export default TeamBuilder;
