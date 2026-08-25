import React from 'react';
import { useApp } from '../store/AppContext';
import { Sparkles } from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const { currentUser, students, setCurrentUser } = useApp();

  if (!currentUser) return null;

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const student = students.find(s => s.id === selectedId);
    if (student) {
      setCurrentUser(student);
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-premium p-3 flex flex-col space-y-2 max-w-[240px] text-left font-sans transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Demo Mode</span>
        </div>
        <Sparkles className="h-3.5 w-3.5 text-primary-500" />
      </div>
      
      <div className="space-y-0.5">
        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Active Profile</span>
        <div className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</div>
        <div className="text-[9px] text-slate-500 truncate leading-none">{currentUser.course} • {currentUser.college}</div>
      </div>

      <div className="space-y-1">
        <label htmlFor="demo-user-select" className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Switch Identity</label>
        <select
          id="demo-user-select"
          value={currentUser.id}
          onChange={handleUserChange}
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default DemoSwitcher;
