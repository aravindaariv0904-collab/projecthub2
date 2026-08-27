import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Toast } from '../../components/Toast';
import { supabase } from '../../lib/supabase';
import { Sparkles, ArrowLeft, Mail, BookOpen, Compass, Award, Link2 } from 'lucide-react';

export const PublicProfileConnect: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Connection state
  const [connStatus, setConnStatus] = useState<string | null>(null);
  const [isOutgoing, setIsOutgoing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadPublicData = async () => {
    if (!profileId) return;

    try {
      setLoading(true);
      setErrorMsg('');

      // 1. Fetch public profile
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (profileErr) throw profileErr;
      setProfile(profileData);

      // 2. Fetch public projects for this student
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('creator_id', profileId);
      
      setProjects(projectsData || []);

      // 3. Fetch connection status if logged in
      if (currentUser) {
        const { data: connData } = await supabase
          .from('connections')
          .select('*')
          .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${currentUser.id})`);

        if (connData && connData.length > 0) {
          const conn = connData[0];
          setConnStatus(conn.status);
          setIsOutgoing(conn.sender_id === currentUser.id);
        }
      }
    } catch (err: any) {
      console.error('Error fetching public profile connect data:', err);
      setErrorMsg('Unable to retrieve student profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, [profileId, currentUser]);

  const handleConnectRequest = async () => {
    if (!currentUser) {
      // Redirect to login page
      navigate(`/login?redirectTo=/connect/${profileId}`);
      return;
    }

    if (currentUser.id === profileId) {
      setToastMsg('You cannot connect with yourself.');
      return;
    }

    try {
      setSubmitting(true);

      // Verify connection does not already exist
      const { data: existingConns } = await supabase
        .from('connections')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${currentUser.id})`);

      if (existingConns && existingConns.length > 0) {
        setToastMsg('A connection request already exists or you are connected.');
        return;
      }

      // Create new connection request
      const { error: connErr } = await supabase
        .from('connections')
        .insert({
          sender_id: currentUser.id,
          receiver_id: profileId,
          status: 'Pending'
        });

      if (connErr) throw connErr;

      // Create notification for the profile owner
      await supabase
        .from('notifications')
        .insert({
          recipient_id: profileId,
          type: 'connection_request',
          title: 'Connection Request',
          message: `${currentUser.name} wants to connect with you.`,
          is_read: false,
          sender_id: currentUser.id,
          action_link: `/profile?id=${currentUser.id}`
        });

      setToastMsg(`Connection request sent to ${profile.name}!`);
      setConnStatus('Pending');
      setIsOutgoing(true);
    } catch (err: any) {
      console.error('Error sending connection request:', err);
      setToastMsg(err.message || 'Unable to submit connect request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-x-hidden relative selection:bg-primary-500 selection:text-white pb-20">
      
      {/* Background patterns */}
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none z-0" />

      {/* Header bar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 z-30 flex items-center">
        <div className="max-w-4xl mx-auto w-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-1.5 rounded-lg text-white shadow-premium">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-primary-950 to-primary-600 bg-clip-text text-transparent">
              PROJECTHUB
            </span>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="font-bold text-xs text-slate-500">
            Go to App
          </Button>
        </div>
      </header>

      {/* Public profile content */}
      <main className="max-w-4xl mx-auto px-6 pt-10 relative z-10 space-y-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3" />
            <span className="text-xs font-semibold">Loading student profile...</span>
          </div>
        ) : errorMsg ? (
          <Card padded className="text-center py-16 bg-white">
            <h3 className="text-sm font-bold text-slate-700">{errorMsg}</h3>
            <Button size="sm" onClick={() => navigate('/')} className="mt-4 font-bold">Return Home</Button>
          </Card>
        ) : profile ? (
          <div className="space-y-6">
            
            {/* Header profile card */}
            <Card padded className="bg-white border border-slate-100 shadow-premium">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name} 
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary-500 shadow"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-extrabold text-2xl">
                      {profile.name.charAt(0)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">{profile.name}</h1>
                    <p className="text-xs text-slate-500 font-semibold">{profile.course} • {profile.year}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">{profile.college}</p>
                  </div>
                </div>

                {/* Connection Action CTA */}
                <div className="shrink-0">
                  {connStatus === 'Connected' ? (
                    <Badge variant="success" size="md">Connected Student</Badge>
                  ) : connStatus === 'Pending' ? (
                    <Badge variant={isOutgoing ? 'warning' : 'primary'} size="md">
                      {isOutgoing ? 'Request Pending' : 'Received Request'}
                    </Badge>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      isLoading={submitting}
                      onClick={handleConnectRequest}
                      leftIcon={<Link2 className="h-4 w-4" />}
                      className="font-bold shadow-premium"
                    >
                      {currentUser ? 'Connect Handshake' : 'Sign In to Connect'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Bio details */}
              {profile.bio && (
                <div className="border-t border-slate-50 mt-6 pt-5 text-left">
                  <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">About Me</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{profile.bio}</p>
                </div>
              )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left columns - Projects list */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Created Projects</h3>
                
                {projects.length === 0 ? (
                  <Card className="text-center py-10 bg-white/50 border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-medium">No published projects yet.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {projects.map((proj) => (
                      <Card key={proj.id} padded className="bg-white border border-slate-100 shadow-premium">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] uppercase font-bold text-primary-600 tracking-wider">
                            {proj.category}
                          </span>
                          <Badge variant="primary" size="sm">{proj.status}</Badge>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{proj.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal truncate-2-lines">{proj.description}</p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Right column - Skills details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Core Skillsets</h3>
                <Card padded className="bg-white border border-slate-100 shadow-premium space-y-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Top Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills && profile.skills.map((skill: any, idx: number) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {profile.interests && profile.interests.length > 0 && (
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Interests</span>
                      <div className="flex flex-wrap gap-1">
                        {profile.interests.map((int: string, idx: number) => (
                          <Badge key={idx} variant="primary" size="sm" className="text-[8px] bg-primary-50 text-primary-600">
                            {int}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

          </div>
        ) : null}
      </main>

      {/* Toast alert */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

    </div>
  );
};

export default PublicProfileConnect;
