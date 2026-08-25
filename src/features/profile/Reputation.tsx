import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Toast } from '../../components/Toast';
import { 
  ShieldCheck, 
  Info, 
  Star, 
  CheckCircle, 
  Users, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Student, Project } from '../../types';

export const Reputation: React.FC = () => {
  const { currentUser, projects, students, submitEndorsements } = useApp();
  
  // Endorsement form states
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedTeammateId, setSelectedTeammateId] = useState('');
  
  // Ratings for categories
  const [techRating, setTechRating] = useState(5);
  const [reliabilityRating, setReliabilityRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [teamworkRating, setTeamworkRating] = useState(5);
  const [taskRating, setTaskRating] = useState(5);
  
  // Selected Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [toastMsg, setToastMsg] = useState('');

  if (!currentUser) return null;

  // Filter projects user participates in
  const myProjects = projects.filter(p => 
    p.creatorId === currentUser.id || 
    p.members.some(m => m.studentId === currentUser.id && m.status === 'Joined')
  );

  // Filter classmates in selected project (excluding me)
  const activeProject = projects.find(p => p.id === selectedProjectId);
  const teammates = activeProject 
    ? activeProject.members
        .filter(m => m.studentId !== currentUser.id && m.status === 'Joined')
        .map(m => students.find(s => s.id === m.studentId))
        .filter(Boolean) as Student[]
    : [];

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitPeerReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedTeammateId) {
      alert('Please select a project and teammate first.');
      return;
    }

    const reviewRatings = [
      { category: 'Technical Contribution' as const, score: techRating },
      { category: 'Reliability' as const, score: reliabilityRating },
      { category: 'Communication' as const, score: commRating },
      { category: 'Teamwork' as const, score: teamworkRating },
      { category: 'Task Completion' as const, score: taskRating }
    ];

    submitEndorsements(
      selectedProjectId,
      selectedTeammateId,
      reviewRatings,
      selectedTags
    );

    const targetStudentName = students.find(s => s.id === selectedTeammateId)?.name || 'teammate';
    setToastMsg(`Endorsements submitted for ${targetStudentName}!`);
    
    // Clear form
    setSelectedTeammateId('');
    setSelectedTags([]);
  };

  const tagOptions = [
    'Reliable', 'Good Communicator', 'Problem Solver', 'Strong Developer', 'Good Teammate'
  ];

  return (
    <div className="space-y-6 fade-in-up text-left font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Collaboration Reputation</h1>
        <p className="text-xs text-slate-500 mt-1">Review score details, read peer endorsements, and submit evaluations for team members.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Own Score & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Standings</span>
              <Badge variant="primary" size="sm">Top Tier</Badge>
            </div>
            
            <div className="flex flex-col items-center py-4">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-28 h-28">
                  <circle className="text-slate-100" strokeWidth="6.5" stroke="currentColor" fill="transparent" r="44" cx="56" cy="56" />
                  <circle className="text-primary-600" strokeWidth="6.5" strokeDasharray="276" strokeDashoffset={276 - (276 * currentUser.collaborationScore) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="44" cx="56" cy="56" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-slate-900">{currentUser.collaborationScore}</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">/100</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mt-4">Verified Collaboration Score</h3>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 border-t border-slate-50 pt-4">
              {currentUser.reputationTags.map(tag => (
                <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
              ))}
            </div>
          </Card>

          {/* Details calculation breakdown */}
          <Card className="space-y-4 text-left">
            <div className="flex items-center space-x-2">
              <Info className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">How is this calculated?</h3>
            </div>
            <div className="space-y-3 text-xs text-slate-500 leading-relaxed">
              <p>Your Collaboration Score is aggregate client side analytics evaluating:</p>
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Task Completion Ratio</span>
                  <span className="text-slate-800">30%</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Peer Ratings (Dimensions feedback)</span>
                  <span className="text-slate-800">40%</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Milestones Deliverables</span>
                  <span className="text-slate-800">20%</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Chat Response Activity</span>
                  <span className="text-slate-800">10%</span>
                </div>
              </div>
              <p className="border-t border-slate-50 pt-2 text-[10px] text-slate-400">
                Scores below 80 reduce your priority rank inside candidate recommendations dashboards. Keep tasks updated!
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: Peer review evaluation form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-5">
            <div className="flex items-center space-x-3 border-b border-slate-50 pb-3 shrink-0">
              <div className="p-2 bg-primary-50 rounded-xl text-primary-600 border shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Submit Peer Endorsement</h3>
                <p className="text-xs text-slate-400 mt-0.5">Rate a project teammate to endorse their skills. Evaluations are transparent and update classmate profiles.</p>
              </div>
            </div>

            {myProjects.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                You must join or create a project team before writing reviews.
              </div>
            ) : (
              <form onSubmit={handleSubmitPeerReview} className="space-y-5 text-left">
                {/* Select Project & Teammate grids */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Select Project Sprints</label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value);
                        setSelectedTeammateId('');
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="">-- Choose Project --</option>
                      {myProjects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Select Teammate</label>
                    <select
                      value={selectedTeammateId}
                      onChange={(e) => setSelectedTeammateId(e.target.value)}
                      disabled={!selectedProjectId}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none disabled:opacity-50"
                    >
                      <option value="">-- Choose Teammate --</option>
                      {teammates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rating sliders */}
                {selectedTeammateId && (
                  <div className="space-y-4 animate-fade-in border-t border-slate-50 pt-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Collaborative Dimensions (Rate 1 to 5)</span>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Technical Contribution', desc: 'Code quality, database schema, design assets integration.', value: techRating, setter: setTechRating },
                        { label: 'Reliability', desc: 'Meeting task deadlines, attending sprint standups.', value: reliabilityRating, setter: setReliabilityRating },
                        { label: 'Communication', desc: 'Active in chat room, responsive on blocking issues.', value: commRating, setter: setCommRating },
                        { label: 'Teamwork', desc: 'Helping peers debug, receptive to dashboard feedback.', value: teamworkRating, setter: setTeamworkRating },
                        { label: 'Task Completion', desc: 'Finishing milestones components completely.', value: taskRating, setter: setTaskRating }
                      ].map((dim, di) => (
                        <div key={di} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-slate-50/50 border gap-3">
                          <div className="text-left max-w-sm">
                            <h5 className="text-xs font-bold text-slate-700 leading-snug">{dim.label}</h5>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{dim.desc}</p>
                          </div>
                          <div className="flex items-center space-x-3 shrink-0">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => dim.setter(star)}
                                  className="focus:outline-none"
                                >
                                  <Star className={`h-4 w-4 ${star <= dim.value ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                </button>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-slate-800 w-4 text-center">{dim.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tag selectors */}
                    <div className="space-y-2 border-t border-slate-50 pt-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Endorse Competency Badges</span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {tagOptions.map(tag => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              type="button"
                              key={tag}
                              onClick={() => handleToggleTag(tag)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                isSelected 
                                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end pt-3 border-t border-slate-50">
                      <Button type="submit" variant="primary" className="font-semibold text-xs py-2">
                        Submit Peer Review
                      </Button>
                    </div>

                  </div>
                )}
              </form>
            )}
          </Card>
        </div>

      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

    </div>
  );
};
export default Reputation;
