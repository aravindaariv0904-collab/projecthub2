import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Toast } from '../../components/Toast';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { ProgressBar } from '../../components/ProgressBar';
import { 
  Briefcase, 
  Trophy, 
  Award, 
  Mail, 
  BookOpen, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle,
  Link2,
  Lock,
  Edit2,
  ExternalLink,
  Bookmark,
  Camera,
  QrCode
} from 'lucide-react';
import { Student, Project } from '../../types';

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={props.className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Profile: React.FC = () => {
  const { 
    currentUser, 
    students, 
    projects, 
    connections, 
    bookmarks,
    sendConnectionRequest, 
    updateProfile,
    acceptConnectionRequest,
    rejectConnectionRequest,
    toggleBookmarkStudent
  } = useApp();
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Settings edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editGithub, setEditGithub] = useState(currentUser?.githubUrl || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatarUrl || '');
  
  const [toastMsg, setToastMsg] = useState('');

  // Scanner Modal trigger state
  const [scannerOpen, setScannerOpen] = useState(false);

  if (!currentUser) return null;

  // Identify whose profile to render
  const targetId = searchParams.get('id');
  const isMe = !targetId || targetId === currentUser.id;

  const profileUser = isMe 
    ? currentUser 
    : students.find(s => s.id === targetId);

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-slate-700">Student Profile Not Found</h3>
        <Button size="sm" onClick={() => navigate('/')} className="mt-4">Return Home</Button>
      </div>
    );
  }

  // Get connection status for other student
  const getConnection = () => {
    if (isMe || !profileUser) return { status: null, isOutgoing: false };
    const conn = connections.find(c => 
      (c.senderId === currentUser.id && c.receiverId === profileUser.id) ||
      (c.senderId === profileUser.id && c.receiverId === currentUser.id)
    );
    if (!conn) return { status: null, isOutgoing: false };
    return { status: conn.status, isOutgoing: conn.senderId === currentUser.id };
  };
  const { status: connStatus, isOutgoing } = getConnection();

  // Filter completed project showcases for this user
  const userShowcases = projects.filter(p => {
    const isOwner = p.creatorId === profileUser.id;
    const isMember = p.members.some(m => m.studentId === profileUser.id && m.status === 'Joined');
    return (isOwner || isMember) && p.status === 'Completed' && p.showcase?.published;
  });

  // Filter ongoing projects
  const activeProjects = projects.filter(p => {
    const isOwner = p.creatorId === profileUser.id;
    const isMember = p.members.some(m => m.studentId === profileUser.id && m.status === 'Joined');
    return (isOwner || isMember) && p.status !== 'Completed';
  });

  const handleConnect = () => {
    sendConnectionRequest(profileUser.id);
    setToastMsg(`Connection handshake sent to ${profileUser.name}!`);
  };

  const handleSaveProfileEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({
      bio: editBio,
      githubUrl: editGithub,
      avatarUrl: editAvatarUrl
    });
    if (res.success) {
      setToastMsg('Profile updated!');
    } else {
      setToastMsg(res.error || 'Failed to update profile.');
    }
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6 fade-in-up text-left">
      {/* Back button if viewing another student */}
      {!isMe && (
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>
      )}

      {/* Main Profile Header card */}
      <Card className="p-6 md:p-8 bg-white border border-slate-100 shadow-premium">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-4 md:space-y-0 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar 
              name={profileUser.name} 
              src={profileUser.avatarUrl} 
              score={profileUser.collaborationScore} 
              size="xl" 
            />
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{profileUser.name}</h1>
              <p className="text-xs text-slate-500 font-semibold">{profileUser.course} • {profileUser.year}</p>
              <p className="text-[11px] text-slate-400 font-semibold">{profileUser.college}</p>
              
              <div className="flex items-center justify-center md:justify-start space-x-3 pt-2 text-xs text-slate-400">
                {profileUser.githubUrl && (
                  <a href={`https://${profileUser.githubUrl}`} target="_blank" rel="noreferrer" className="hover:text-slate-900 flex items-center space-x-1">
                    <Github className="h-4 w-4" />
                    <span className="font-semibold">{profileUser.githubUrl.split('/').pop()}</span>
                  </a>
                )}
                <span className="h-1 w-1 bg-slate-200 rounded-full" />
                <span className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{profileUser.email}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action parameters */}
          <div className="flex items-center space-x-2 shrink-0">
            {!isMe && (
              <button
                onClick={() => {
                  toggleBookmarkStudent(profileUser.id);
                  const isSaved = bookmarks.studentIds.includes(profileUser.id);
                  setToastMsg(isSaved ? `Removed ${profileUser.name} from bookmarks.` : `Bookmarked ${profileUser.name}!`);
                }}
                className={`p-2 border rounded-xl transition-all shadow-sm ${
                  bookmarks.studentIds.includes(profileUser.id)
                    ? 'bg-primary-50 border-primary-200 text-primary-600 hover:bg-primary-100'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                title={bookmarks.studentIds.includes(profileUser.id) ? 'Remove Bookmark' : 'Bookmark Student'}
              >
                <Bookmark className="h-4 w-4" fill={bookmarks.studentIds.includes(profileUser.id) ? 'currentColor' : 'none'} />
              </button>
            )}

            {isMe ? (
              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setScannerOpen(true)}
                  leftIcon={<Camera className="h-4 w-4" />}
                >
                  Scan QR
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setEditBio(currentUser.bio);
                    setEditGithub(currentUser.githubUrl);
                    setEditAvatarUrl(currentUser.avatarUrl || '');
                    setEditModalOpen(true);
                  }}
                  leftIcon={<Edit2 className="h-4 w-4" />}
                >
                  Edit Bio
                </Button>
              </div>
            ) : connStatus === 'Connected' ? (
              <Badge variant="success" size="md">
                Connected
              </Badge>
            ) : connStatus === 'Pending' ? (
              isOutgoing ? (
                <Badge variant="warning" size="md">
                  Request Sent
                </Badge>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => {
                      acceptConnectionRequest(profileUser.id);
                      setToastMsg(`You are now connected with ${profileUser.name}!`);
                    }}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      rejectConnectionRequest(profileUser.id);
                      setToastMsg(`Request ignored.`);
                    }}
                  >
                    Ignore
                  </Button>
                </div>
              )
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleConnect}
                leftIcon={<Link2 className="h-4 w-4" />}
              >
                Connect Handshake
              </Button>
            )}
          </div>
        </div>

        {/* Bio segment */}
        <div className="border-t border-slate-50 mt-6 pt-5 text-left">
          <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Student Pitch Bio</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{profileUser.bio}</p>
        </div>
      </Card>

      {/* Grid segments: Left 2/3 for projects, Right 1/3 for reputation score details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Projects Showcases */}
        <div className="lg:col-span-2 space-y-6">
          {/* Completed Showcases portfolio */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Completed Project Showcase</h2>
            
            {userShowcases.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-200 bg-slate-50/20">
                <Trophy className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">No completed project showcases published yet.</p>
              </Card>
            ) : (
              userShowcases.map(showProj => (
                <Card key={showProj.id} className="p-5 text-left border-l-4 border-l-emerald-500 space-y-4 shadow-premium">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{showProj.category}</span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{showProj.name}</h4>
                    </div>
                    <Badge variant="success" size="sm">Completed Showcase</Badge>
                  </div>
                  
                  <p className="text-xs text-slate-500 leading-relaxed truncate-3-lines">{showProj.description}</p>
                  
                  {showProj.showcase && (
                    <div className="space-y-3 pt-3 border-t border-slate-50">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Solution Implementation</span>
                        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{showProj.showcase.solution}</p>
                      </div>
                      
                      {showProj.showcase.achievements.length > 0 && (
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">Key Achievements</span>
                          <div className="flex flex-wrap gap-1">
                            {showProj.showcase.achievements.map((ach, ai) => (
                              <Badge key={ai} variant="primary" size="sm" className="text-[8px] bg-primary-50 text-primary-600">{ach}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-slate-50 mt-4 pt-3 flex justify-between items-center text-[10px] text-slate-400 shrink-0">
                    <div className="flex items-center space-x-1 font-medium">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Finished on {showProj.showcase?.completionDate}</span>
                    </div>
                    
                    {showProj.showcase?.liveDemoUrl && (
                      <a href={showProj.showcase.liveDemoUrl} target="_blank" rel="noreferrer" className="text-primary-600 font-semibold hover:underline flex items-center space-x-1 shrink-0">
                        <span>Live Demo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Ongoing/Active Projects */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Current Projects</h2>
            
            {activeProjects.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-6 text-center border-dashed border-slate-200 bg-slate-50/20">
                <Briefcase className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">No active ongoing projects.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeProjects.map(proj => (
                  <Card key={proj.id} className="p-4 flex flex-col justify-between border-slate-100 shadow-premium">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{proj.category}</span>
                        <Badge variant="primary" size="sm">{proj.status}</Badge>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug truncate mt-1.5">{proj.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal truncate-2-lines">{proj.description}</p>
                    </div>
                    <div className="mt-4 shrink-0">
                      <ProgressBar value={proj.progress} size="sm" showLabel={false} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reputation & Endorsements */}
        <div className="space-y-6">
          
          {/* PROJECTHUB PROFILE CARD */}
          <Card className="p-6 text-center bg-white border border-slate-100 shadow-premium flex flex-col items-center space-y-4">
            <div className="border-b border-slate-50 pb-2 w-full text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PROJECTHUB PROFILE CARD</span>
            </div>
            
            <div className="flex items-center space-x-3 w-full text-left bg-slate-50 p-3 rounded-xl border border-slate-100/50">
              {profileUser.avatarUrl ? (
                <img src={profileUser.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-100" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                  {profileUser.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{profileUser.name}</h4>
                <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-0.5">{profileUser.course}</p>
                <p className="text-[9px] text-slate-300 font-medium truncate leading-none mt-1">{profileUser.college}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1">
              {profileUser.skills.slice(0, 4).map((s: any, idx: number) => (
                <span key={idx} className="text-[9px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-bold">{s.name}</span>
              ))}
            </div>

            {/* QR Image Box */}
            <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm relative">
              {/* Scan box lines */}
              <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-primary-500" />
              <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-primary-500" />
              <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-primary-500" />
              <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-primary-500" />
              
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(window.location.origin + '/connect/' + profileUser.id)}`} 
                alt="Profile QR Code" 
                className="w-32 h-32 select-none" 
              />
            </div>
            
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold tracking-wide">Scan to Connect</span>
              <span className="text-[9px] text-slate-350 block mt-0.5 font-mono">ID: {profileUser.id.substring(0, 8)}...</span>
            </div>

            {/* Action buttons */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-slate-50 text-[10px] font-bold text-slate-500">
              <a 
                href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + '/connect/' + profileUser.id)}`}
                target="_blank"
                rel="noreferrer"
                download="qr_code.png"
                className="w-full text-center py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg block"
              >
                Download QR
              </a>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/connect/' + profileUser.id);
                  setToastMsg('Copied profile connection link!');
                }}
                className="w-full py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </Card>

          {/* Stats details */}
          <Card className="text-center relative">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left mb-3">Collaboration Score</span>
            
            <div className="flex flex-col items-center py-3">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-20 h-20">
                  <circle className="text-slate-100" strokeWidth="5" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                  <circle className="text-primary-600" strokeWidth="5" strokeDasharray="201" strokeDashoffset={201 - (201 * profileUser.collaborationScore) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-slate-900">{profileUser.collaborationScore}</span>
                </div>
              </div>
              <h3 className="text-xs font-bold text-slate-800 mt-3">Verified Standings</h3>
            </div>

            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {profileUser.reputationTags.map(tag => (
                <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
              ))}
            </div>
          </Card>

          {/* Endorsements breakdown */}
          <Card className="space-y-3.5 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Teammate Endorsements</h3>
            
            <div className="space-y-3">
              {profileUser.endorsements.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No verified peer endorsements recorded.
                </div>
              ) : (
                profileUser.endorsements.map((end, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 leading-snug">{end.category}</span>
                      <Badge variant="primary" size="sm" className="font-bold">{end.count}</Badge>
                    </div>
                    <span className="text-[9px] text-slate-400 block leading-relaxed">
                      Endorsed by: {end.senderNames.join(', ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* Edit Bio settings Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile Information"
        footer={
          <>
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold border rounded-lg transition-colors bg-white font-sans"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfileEdit}
              className="px-4 py-1.5 text-xs text-white bg-primary-600 hover:bg-primary-700 font-semibold rounded-lg shadow-sm transition-colors font-sans"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveProfileEdit} className="space-y-4 text-left font-sans">
          {/* Preset options */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Profile Photo Presets</label>
            <div className="flex items-center space-x-2">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120'
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEditAvatarUrl(preset)}
                  className={`h-9 w-9 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                    editAvatarUrl === preset ? 'border-primary-500 scale-105 shadow-sm' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={preset} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          <Input
            label="Custom Photo URL"
            placeholder="https://unsplash.com/your-photo"
            value={editAvatarUrl}
            onChange={(e) => setEditAvatarUrl(e.target.value)}
          />

          <Input
            label="Short Bio Pitch"
            placeholder="Tell us what you do..."
            textarea
            rows={4}
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
          />
          <Input
            label="GitHub Username"
            placeholder="github.com/your-username"
            value={editGithub}
            onChange={(e) => setEditGithub(e.target.value)}
          />
        </form>
      </Modal>

      {/* Simulated Scanner Modal */}
      {scannerOpen && (
        <Modal
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          title="Scan Profile QR Code"
          size="md"
        >
          <div className="space-y-4 text-center font-sans">
            <p className="text-xs text-slate-500 leading-normal">
              Align a student's ProjectHub QR profile card within the viewport to connect instantly.
            </p>
            
            {/* Blinking camera scanning box */}
            <div className="w-56 h-56 mx-auto bg-slate-900 border-2 border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner">
              {/* Scan target lines */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary-500" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary-500" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary-500" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary-500" />
              
              <QrCode className="h-20 w-20 text-slate-800" />
            </div>

            {/* Simulating scanning shortcuts */}
            <div className="space-y-2 border-t border-slate-50 pt-3 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Simulate Scan (Select peer profile)</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setScannerOpen(false);
                    navigate(`/connect/${e.target.value}`);
                  }
                }}
                defaultValue=""
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-primary-500 focus:outline-none"
              >
                <option value="" disabled>-- Select student to scan --</option>
                {students.filter(s => s.id !== currentUser.id).map(student => (
                  <option key={student.id} value={student.id}>{student.name} ({student.college || 'Peer'})</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <Button 
                variant="outline" 
                onClick={() => setScannerOpen(false)}
                className="w-full font-bold"
              >
                Cancel Scanner
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast popup */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

    </div>
  );
};
export default Profile;
