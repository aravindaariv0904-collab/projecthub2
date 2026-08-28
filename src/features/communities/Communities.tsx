import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  MessageSquare, 
  Users, 
  Plus, 
  ArrowLeft, 
  Send,
  Compass,
  Sparkles,
  Info,
  Volume2
} from 'lucide-react';

export const Communities: React.FC = () => {
  const { currentUser, students, communities } = useApp();
  
  // Real database states
  const [communitiesList, setCommunitiesList] = useState<any[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<any | null>(null);
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState<any[]>([]);
  
  // UX states
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Joins list (synced to localStorage per user)
  const [joinedIds, setJoinedIds] = useState<string[]>(() => {
    if (!currentUser) return [];
    try {
      const stored = localStorage.getItem(`ph_joined_communities_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Create community modal form
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [commName, setCommName] = useState('');
  const [commDesc, setCommDesc] = useState('');
  const [commCat, setCommCat] = useState('AI & ML');
  const [submitting, setSubmitting] = useState(false);

  // Chat message input
  const [inputText, setInputText] = useState('');
  
  // Chat thread scroll ref
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Sync joined communities to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`ph_joined_communities_${currentUser.id}`, JSON.stringify(joinedIds));
    }
  }, [joinedIds, currentUser]);

  // Fetch communities list from Supabase or Local
  const loadCommunities = async () => {
    if (!isSupabaseConfigured) {
      setCommunitiesList(communities || []);
      if (communities && communities.length > 0 && !selectedCommunity) {
        setSelectedCommunity(communities[0]);
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCommunitiesList(data && data.length > 0 ? data : (communities || []));

      // Autofocus first community if available and none selected
      if (data && data.length > 0 && !selectedCommunity) {
        setSelectedCommunity(data[0]);
      } else if (communities && communities.length > 0 && !selectedCommunity) {
        setSelectedCommunity(communities[0]);
      }
    } catch (err: any) {
      console.warn('Fallback to local communities:', err);
      setCommunitiesList(communities || []);
      if (communities && communities.length > 0 && !selectedCommunity) {
        setSelectedCommunity(communities[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  // Fetch messages from Supabase or Local
  const loadMessages = async () => {
    if (!selectedCommunity) return;

    if (!isSupabaseConfigured) {
      const localPosts = (selectedCommunity.posts || []).map((p: any) => ({
        id: p.id,
        community_id: selectedCommunity.id,
        title: activeChannel,
        content: p.content,
        created_at: p.timestamp || new Date().toISOString(),
        profiles: {
          id: p.authorId,
          name: p.authorName,
          avatar_url: p.authorAvatar
        }
      }));
      setMessages(localPosts);
      setChatLoading(false);
      return;
    }

    try {
      setChatLoading(true);
      
      // Query community_posts table filtering by current community & title = activeChannel
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:author_id(id, name, avatar_url)
        `)
        .eq('community_id', selectedCommunity.id)
        .eq('title', activeChannel)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.warn('Fallback to local messages:', err);
      const localPosts = (selectedCommunity.posts || []).map((p: any) => ({
        id: p.id,
        community_id: selectedCommunity.id,
        title: activeChannel,
        content: p.content,
        created_at: p.timestamp || new Date().toISOString(),
        profiles: {
          id: p.authorId,
          name: p.authorName,
          avatar_url: p.authorAvatar
        }
      }));
      setMessages(localPosts);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [selectedCommunity, activeChannel]);

  // Realtime subscription setup
  useEffect(() => {
    if (!selectedCommunity || !isSupabaseConfigured) return;

    // Establish subscription to community_posts table inserts for this community
    const channel = supabase
      .channel(`community-chat-${selectedCommunity.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts',
          filter: `community_id=eq.${selectedCommunity.id}`
        },
        async (payload) => {
          // If message is in a different channel, skip appending
          if (payload.new.title !== activeChannel) return;

          // Fetch sender profile details
          const { data: authorData } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .eq('id', payload.new.author_id)
            .single();

          const messageWithAuthor = {
            ...payload.new,
            profiles: authorData
          };

          setMessages((prev) => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, messageWithAuthor];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCommunity, activeChannel]);

  // Scroll to bottom helper
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentUser) return null;

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCommunity || !inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    const newLocalMsg = {
      id: `msg-${Date.now()}`,
      community_id: selectedCommunity.id,
      title: activeChannel,
      content: textToSend,
      author_id: currentUser.id,
      created_at: new Date().toISOString(),
      profiles: {
        id: currentUser.id,
        name: currentUser.name,
        avatar_url: currentUser.avatarUrl
      }
    };

    setMessages(prev => [...prev, newLocalMsg]);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('community_posts')
          .insert({
            community_id: selectedCommunity.id,
            title: activeChannel,
            content: textToSend,
            author_id: currentUser.id
          });
      } catch (err: any) {
        console.warn('Supabase post message error:', err);
      }
    }
  };

  // Create Community Handler
  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commName.trim()) return;

    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('communities')
        .insert({
          name: commName.trim(),
          description: commDesc.trim() || null,
          category: commCat,
          members_count: 1
        })
        .select()
        .single();

      if (error) throw error;

      setToastMsg('Community created successfully!');
      
      // Auto-join creator to this community
      if (data) {
        setJoinedIds(prev => [...prev, data.id]);
        setSelectedCommunity(data);
      }

      setCreateModalOpen(false);
      setCommName('');
      setCommDesc('');
      loadCommunities(); // Re-fetch
    } catch (err: any) {
      console.error('Error creating community:', err);
      setToastMsg(err.message || 'Unable to create community. Confirm RLS policy has been set.');
    } finally {
      setSubmitting(false);
    }
  };

  // Join Community Handler
  const handleJoinLeaveCommunity = () => {
    if (!selectedCommunity) return;

    const isJoined = joinedIds.includes(selectedCommunity.id);
    if (isJoined) {
      // Leave
      setJoinedIds(prev => prev.filter(id => id !== selectedCommunity.id));
      setToastMsg(`Left community "${selectedCommunity.name}"`);
    } else {
      // Join
      setJoinedIds(prev => [...prev, selectedCommunity.id]);
      setToastMsg(`Joined community "${selectedCommunity.name}"!`);
    }
  };

  // Filter lists: My Communities vs Discover List
  const myCommunities = communitiesList.filter(c => joinedIds.includes(c.id));
  const discoverCommunities = communitiesList.filter(c => !joinedIds.includes(c.id));

  // Determine members list based on community category deterministically
  const getCommunityMembers = () => {
    if (!selectedCommunity) return [];
    
    // Select student profiles whose skills match this category theme
    const category = selectedCommunity.category?.toLowerCase() || '';
    const filtered = students.filter(s => {
      const skills = s.skills.map(sk => sk.name.toLowerCase());
      if (category.includes('ai') || category.includes('ml')) {
        return skills.includes('python') || skills.includes('pytorch') || skills.includes('nlp');
      }
      if (category.includes('web') || category.includes('design')) {
        return skills.includes('react') || skills.includes('figma') || skills.includes('tailwind css') || skills.includes('ui/ux design');
      }
      if (category.includes('iot') || category.includes('robotics')) {
        return skills.includes('go') || skills.includes('docker') || skills.includes('postgresql');
      }
      return true;
    });

    // Make sure current user is in the list if they are joined
    const isJoined = joinedIds.includes(selectedCommunity.id);
    const list = [...filtered.slice(0, 5)];
    if (isJoined && !list.some(m => m.id === currentUser.id)) {
      list.push(currentUser);
    }
    return list;
  };

  const communityMembers = getCommunityMembers();
  const isCurrentlyJoined = selectedCommunity && joinedIds.includes(selectedCommunity.id);

  return (
    <div className="h-[calc(100vh-8.5rem)] min-h-[500px] border border-slate-100 rounded-2xl bg-white shadow-premium overflow-hidden flex flex-col font-sans">
      
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3" />
          <span className="text-xs font-semibold">Loading community hubs...</span>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT SIDEBAR: Communities & Channels (25%) */}
          <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-left text-slate-400">
            {/* Header section with Post triggers */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-white tracking-wide uppercase">My Communities</span>
              <button 
                onClick={() => setCreateModalOpen(true)}
                className="p-1 hover:bg-slate-800 hover:text-white rounded transition-colors text-primary-400 cursor-pointer"
                title="Create Community"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* My Communities List scrollbox */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 select-none">
              {myCommunities.length === 0 ? (
                <div className="text-[10px] text-slate-500 py-6 px-3 text-center">
                  You haven't joined any communities yet. Click "Discover" to browse.
                </div>
              ) : (
                myCommunities.map((comm) => (
                  <button
                    key={comm.id}
                    onClick={() => {
                      setSelectedCommunity(comm);
                      setActiveChannel('general');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all block truncate cursor-pointer ${
                      selectedCommunity?.id === comm.id
                        ? 'bg-primary-600 text-white shadow'
                        : 'hover:bg-slate-800/50 hover:text-slate-200 text-slate-400'
                    }`}
                  >
                    <span>{comm.name}</span>
                  </button>
                ))
              )}

              {/* Discover Communities header divider */}
              <div className="pt-4 pb-2 px-3 flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Discover Spaces</span>
                <Compass className="h-3 w-3 text-slate-500" />
              </div>

              {discoverCommunities.length === 0 ? (
                <div className="text-[10px] text-slate-600 px-3 text-center py-2">
                  No other spaces to explore.
                </div>
              ) : (
                discoverCommunities.map((comm) => (
                  <button
                    key={comm.id}
                    onClick={() => {
                      setSelectedCommunity(comm);
                      setActiveChannel('general');
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all block truncate cursor-pointer ${
                      selectedCommunity?.id === comm.id
                        ? 'bg-slate-800 text-slate-200'
                        : 'hover:bg-slate-800/30 hover:text-slate-300 text-slate-500'
                    }`}
                  >
                    <span>{comm.name}</span>
                  </button>
                ))
              )}
            </div>

            {/* Selected Community Active Channels list */}
            {selectedCommunity && isCurrentlyJoined && (
              <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">CHANNELS</span>
                <div className="space-y-1">
                  {['general', 'project-ideas', 'resources', 'opportunities'].map((chan) => (
                    <button
                      key={chan}
                      onClick={() => setActiveChannel(chan)}
                      className={`w-full text-left px-2 py-1 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                        activeChannel === chan
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-slate-400 font-bold">#</span>
                      <span className="truncate">{chan}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CENTER CHAT PANEL (55%) */}
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden text-left relative">
            {selectedCommunity ? (
              <>
                {/* Community top info bar */}
                <div className="h-14 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-50 p-1.5 rounded-lg text-primary-600">
                      <MessageSquare className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-none">{selectedCommunity.name}</h3>
                      <p className="text-[10px] text-slate-400 leading-none mt-1 font-semibold">
                        Category: {selectedCommunity.category} • #{activeChannel}
                      </p>
                    </div>
                  </div>

                  {/* Join / Leave button */}
                  <Button
                    variant={isCurrentlyJoined ? "outline" : "primary"}
                    size="sm"
                    onClick={handleJoinLeaveCommunity}
                    className="font-bold text-xs"
                  >
                    {isCurrentlyJoined ? 'Leave Space' : 'Join Space'}
                  </Button>
                </div>

                {/* Message feed stream */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {!isCurrentlyJoined ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <Users className="h-12 w-12 text-slate-300 mb-3" />
                      <h4 className="text-sm font-bold text-slate-800">Private Community Circle</h4>
                      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
                        Join this community space to view the active conversation stream, browse tech resources, and chat with members.
                      </p>
                      <Button variant="primary" size="sm" onClick={handleJoinLeaveCommunity} className="font-bold">
                        Join Community Space
                      </Button>
                    </div>
                  ) : chatLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mb-2" />
                      <span className="text-[10px] font-semibold">Restoring channel conversation...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                      <Volume2 className="h-8 w-8 text-slate-300 mb-2" />
                      <h4 className="text-xs font-bold text-slate-800">Welcome to #{activeChannel}!</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mt-1">
                        This is the beginning of the #{activeChannel} channel feed. Type a message below to start the conversation!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const sender = msg.profiles;
                      const initials = sender?.name?.split(' ').map((n: string)=>n[0]).join('') || 'U';
                      
                      return (
                        <div key={msg.id} className="flex items-start space-x-3 text-xs leading-normal">
                          {sender?.avatar_url ? (
                            <img 
                              src={sender.avatar_url} 
                              alt="" 
                              className="w-8 h-8 rounded-full object-cover border border-slate-100"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px]">
                              {initials}
                            </div>
                          )}

                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-800">{sender?.name || 'Student'}</span>
                              <span className="text-[9px] text-slate-400 font-semibold">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-slate-650 font-medium leading-relaxed break-words">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={threadEndRef} />
                </div>

                {/* Message input bar */}
                {isCurrentlyJoined && (
                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex items-center space-x-2 shrink-0">
                    <input
                      type="text"
                      placeholder={`Type a message in #${activeChannel}...`}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <Button 
                      variant="primary" 
                      size="md" 
                      type="submit"
                      disabled={!inputText.trim()}
                      className="font-bold uppercase tracking-wider text-[10px] px-4"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
                <h4 className="text-xs font-bold text-slate-800">Select a Space</h4>
                <p className="text-[10px] text-slate-500">Pick a community space in the left sidebar to start chatting.</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: Members Panel (20%) */}
          {selectedCommunity && isCurrentlyJoined && (
            <div className="w-48 bg-slate-50 border-l border-slate-100 flex flex-col shrink-0 text-left p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Members ({communityMembers.length})</span>
              
              <div className="flex-1 overflow-y-auto space-y-2 select-none">
                {communityMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2 text-xs">
                    <div className="relative shrink-0">
                      {member.avatarUrl ? (
                        <img 
                          src={member.avatarUrl} 
                          alt="" 
                          className="w-6 h-6 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[9px]">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      {/* Active online status light indicator */}
                      <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-slate-800 truncate block leading-tight">{member.name}</span>
                      <span className="text-[8px] text-slate-400 font-semibold truncate block leading-none">
                        {member.id === currentUser.id ? 'Owner' : 'Member'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Create Community Form Modal */}
      {createModalOpen && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create a New Community Circle"
          size="md"
        >
          <form onSubmit={handleCreateCommunity} className="space-y-4 text-left font-sans">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Community Name *</label>
              <Input
                type="text"
                placeholder="e.g. AI & Machine Learning Research"
                value={commName}
                onChange={(e) => setCommName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
              <textarea
                placeholder="Provide a brief description explaining the community goals."
                value={commDesc}
                onChange={(e) => setCommDesc(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category *</label>
              <select
                value={commCat}
                onChange={(e) => setCommCat(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-primary-500 focus:outline-none"
              >
                <option value="AI & ML">AI & ML</option>
                <option value="Web Development">Web Development</option>
                <option value="IoT">IoT</option>
                <option value="Robotics">Robotics</option>
                <option value="Hackathons">Hackathons</option>
                <option value="Startups">Startups</option>
                <option value="Research">Research</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setCreateModalOpen(false)}
                className="w-full font-bold"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                isLoading={submitting}
                className="w-full font-bold"
              >
                Create Community
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Active toast feedback alerts */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

    </div>
  );
};

export default Communities;
