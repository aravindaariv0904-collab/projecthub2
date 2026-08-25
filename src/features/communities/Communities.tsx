import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { 
  MessageSquare, 
  Users, 
  Briefcase, 
  ArrowLeft, 
  Plus, 
  Heart, 
  Share2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Community, Post } from '../../types';

export const Communities: React.FC = () => {
  const { currentUser, communities, updateProject } = useApp(); // Wait, we can modify communities locally or via global states!
  const { setCommunities } = useApp() as any; // Wait, AppContext has communities list. Since communities is in AppContext state, we can add updates. Let's make sure we update it cleanly.

  // Context contains state and sync for communities. Let's implement local community details page
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  
  // Post modal triggers
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState('');

  if (!currentUser) return null;

  const selectedComm = communities.find(c => c.id === selectedCommunityId);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommunityId || !postTitle || !postContent) return;

    const newPost: Post = {
      id: `post-${Math.random().toString(36).substr(2, 9)}`,
      title: postTitle,
      content: postContent,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      timestamp: new Date().toISOString(),
      likes: 0,
      commentsCount: 0
    };

    // Update community posts inside app context
    selectedComm!.posts = [newPost, ...selectedComm!.posts];
    setPostTitle('');
    setPostContent('');
    setPostModalOpen(false);
    setToastMsg('Post shared with community!');
  };

  const handleLikePost = (postId: string) => {
    if (!selectedComm) return;
    selectedComm.posts = selectedComm.posts.map(p => 
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    );
    setToastMsg('Post liked!');
  };

  // 1. DETAIL COMMUNITY PAGE RENDER
  if (selectedComm) {
    return (
      <div className="space-y-6 fade-in-up text-left">
        {/* Header */}
        <div>
          <button 
            onClick={() => setSelectedCommunityId(null)}
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to community circles</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-left">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">COMMUNITY SPACE</span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{selectedComm.name}</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">{selectedComm.description}</p>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setPostModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Share Something
            </Button>
          </div>
        </div>

        {/* Info tags */}
        <div className="flex space-x-6 text-xs text-slate-400 border-b border-t border-slate-100 py-3 text-left">
          <div className="flex items-center space-x-1.5">
            <Users className="h-4.5 w-4.5 shrink-0" />
            <span><span className="font-bold text-slate-700">{selectedComm.membersCount}</span> Members</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Briefcase className="h-4.5 w-4.5 shrink-0" />
            <span><span className="font-bold text-slate-700">{selectedComm.projectsCount}</span> Active Projects</span>
          </div>
        </div>

        {/* Posts thread */}
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-left mb-2">Discussion Threads</h3>
          {selectedComm.posts.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-200">
              <MessageSquare className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 mb-3">No posts inside this circle yet. Be the first to share updates!</p>
              <Button size="sm" onClick={() => setPostModalOpen(true)}>Create Thread</Button>
            </Card>
          ) : (
            selectedComm.posts.map(post => (
              <Card key={post.id} className="p-5 text-left space-y-4 border-slate-100 shadow-premium">
                
                {/* Author block */}
                <div className="flex items-center space-x-2.5">
                  <Avatar name={post.authorName} src={post.authorAvatar} size="xs" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 leading-snug">{post.authorName}</span>
                    <span className="text-[9px] text-slate-400 block font-medium mt-0.5">
                      Shared {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{post.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                {/* Social Actions */}
                <div className="border-t border-slate-50 mt-4 pt-3 flex space-x-4 text-xs text-slate-400 shrink-0">
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center space-x-1.5 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-4 w-4 shrink-0" />
                    <span>{post.likes}</span>
                  </button>
                  <div className="flex items-center space-x-1.5 select-none">
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span>{post.commentsCount} Comments</span>
                  </div>
                </div>

              </Card>
            ))
          )}
        </div>

        {/* Share Thread Modal */}
        <Modal
          isOpen={postModalOpen}
          onClose={() => setPostModalOpen(false)}
          title="Share Community Thread"
          footer={
            <>
              <button
                onClick={() => setPostModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold border rounded-lg transition-colors bg-white font-sans"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-1.5 text-xs text-white bg-primary-600 hover:bg-primary-700 font-semibold rounded-lg shadow-sm transition-colors font-sans"
              >
                Publish Post
              </button>
            </>
          }
        >
          <form onSubmit={handleCreatePost} className="space-y-4 text-left font-sans">
            <Input
              label="Thread Title"
              placeholder="e.g. Seeking recommendations for local quant models..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Body Content"
              placeholder="Share details, resource links, questions..."
              textarea
              rows={4}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
            />
          </form>
        </Modal>

        {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
      </div>
    );
  }

  // 2. BROWSE ALL COMMUNITIES PAGE RENDER
  return (
    <div className="space-y-6 fade-in-up text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Communities</h1>
        <p className="text-xs text-slate-500 mt-1">Connect with student builder circles based on specialized disciplines.</p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((comm) => (
          <Card 
            key={comm.id} 
            hoverable 
            className="flex flex-col justify-between cursor-pointer border-slate-100 shadow-premium"
            onClick={() => setSelectedCommunityId(comm.id)}
          >
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-left">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  {comm.category}
                </span>
                <Badge variant="primary" size="sm">
                  {comm.posts.length} thread(s)
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 leading-snug">{comm.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">{comm.description}</p>
              </div>
            </div>

            {/* Stats row footer */}
            <div className="border-t border-slate-50 mt-5 pt-3.5 flex justify-between items-center shrink-0 text-[10px] text-slate-400">
              <div className="flex items-center space-x-1.5 font-medium">
                <Users className="h-4 w-4 shrink-0" />
                <span>{comm.membersCount} members</span>
              </div>
              <div className="flex items-center space-x-1.5 font-medium">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span>{comm.projectsCount} projects</span>
              </div>
            </div>

          </Card>
        ))}
      </div>

    </div>
  );
};
export default Communities;
