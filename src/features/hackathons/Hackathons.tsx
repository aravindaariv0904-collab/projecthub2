import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Toast } from '../../components/Toast';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Bookmark, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export const Hackathons: React.FC = () => {
  const { hackathons, bookmarks, toggleBookmarkHackathon } = useApp();
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState('');

  const handleSaveHackathon = (id: string, name: string) => {
    toggleBookmarkHackathon(id);
    const isSaved = bookmarks.hackathonIds.includes(id);
    setToastMsg(isSaved ? `Removed "${name}" from bookmarks.` : `Saved "${name}" to bookmarks!`);
  };

  const handleFindTeam = (hackName: string) => {
    // Navigate to team builder recruiting for this hackathon context
    navigate(`/team-builder`);
  };

  return (
    <div className="space-y-6 fade-in-up text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hackathon Center</h1>
        <p className="text-xs text-slate-500 mt-1">Discover upcoming hackathons, bookmark events, and find teammate candidates.</p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hackathons.map((hack) => {
          const isSaved = bookmarks.hackathonIds.includes(hack.id);
          
          return (
            <Card key={hack.id} className="flex flex-col justify-between border-slate-100 shadow-premium">
              <div className="space-y-4">
                
                {/* Header details */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={hack.logo} 
                      alt="" 
                      className="h-12 w-12 rounded-xl object-cover border border-slate-100 shrink-0 shadow-sm" 
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 leading-snug truncate max-w-[200px]">{hack.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-none">Format: virtual & on-site</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveHackathon(hack.id, hack.name)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSaved 
                        ? 'bg-primary-50 border-primary-200 text-primary-600' 
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>

                {/* Theme Description */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">THEME TRACK</span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5">{hack.theme}</p>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Eligibility: {hack.eligibility} • Max size: {hack.teamSizeRange}.
                  </p>
                </div>

                {/* Technical Skills Required */}
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">Common Recruiting Competencies</span>
                  <div className="flex flex-wrap gap-1">
                    {hack.requiredSkills.map(skill => (
                      <Badge key={skill} variant="neutral" size="sm" className="text-[8px] px-1.5 bg-slate-50">{skill}</Badge>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer actions */}
              <div className="border-t border-slate-50 mt-5 pt-4 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Due: {hack.deadline}</span>
                </div>
                
                <div className="flex space-x-2.5 shrink-0">
                  <button 
                    onClick={() => handleSaveHackathon(hack.id, hack.name)}
                    className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                  >
                    {isSaved ? 'Bookmarked' : 'Save Event'}
                  </button>
                  <Button 
                    size="sm" 
                    onClick={() => handleFindTeam(hack.name)}
                    rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                    className="text-[11px] font-semibold py-1.5 px-3"
                  >
                    Find Teammates
                  </Button>
                </div>
              </div>

            </Card>
          );
        })}
      </div>

      {toastMsg && (
        <Toast 
          message={toastMsg} 
          onClose={() => setToastMsg('')} 
        />
      )}

    </div>
  );
};
export default Hackathons;
