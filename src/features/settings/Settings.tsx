import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Toast } from '../../components/Toast';
import { Settings as SettingsIcon, User, Lock, Bell, Image, ShieldCheck } from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('Freshman');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('password123');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification options state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Synchronize fields when currentUser is swapped
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setCollege(currentUser.college);
      setCourse(currentUser.course);
      setYear(currentUser.year);
      setAvatarUrl(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({
      name,
      email,
      college,
      course,
      year,
      avatarUrl
    });
    if (res.success) {
      setToastMsg('Settings updated successfully!');
      setToastType('success');
    } else {
      setToastMsg(res.error || 'Failed to update settings.');
      setToastType('error');
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToastMsg('New passwords do not match!');
      setToastType('error');
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      setToastMsg('Password updated successfully!');
      setToastType('success');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setToastMsg(error.message || 'Failed to update password.');
      setToastType('error');
    }
  };

  const yearOptions = [
    { value: 'Freshman', label: 'Freshman' },
    { value: 'Sophomore', label: 'Sophomore' },
    { value: 'Junior', label: 'Junior' },
    { value: 'Senior', label: 'Senior' }
  ];

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in-up text-left font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your student profile records, major updates, and notifications parameters.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Card */}
        <Card className="p-6 md:p-8 space-y-5 text-left border border-slate-100 shadow-premium bg-white">
          <div className="flex items-center space-x-3 border-b border-slate-50 pb-3 shrink-0">
            <div className="p-2 bg-primary-50 rounded-xl text-primary-600 border shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Profile Details</h3>
              <p className="text-xs text-slate-400 mt-0.5">This credentials profile is visible to team organizers.</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="College Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="College/University Name"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Course / Major"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
              <Select
                label="Current Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                options={yearOptions}
              />
            </div>

            {/* Simulated Avatar presets selection */}
            <div className="space-y-2 border-t border-slate-50 pt-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Profile Photo Presets</label>
              <div className="flex items-center space-x-3">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`h-11 w-11 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                      avatarUrl === preset ? 'border-primary-500 scale-105 shadow-sm' : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img src={preset} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-50">
              <Button type="submit" variant="primary" className="font-semibold text-xs py-2">
                Save Account Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Security / Password Card */}
        <Card className="p-6 md:p-8 space-y-5 text-left border border-slate-100 shadow-premium bg-white">
          <div className="flex items-center space-x-3 border-b border-slate-50 pb-3 shrink-0">
            <div className="p-2 bg-primary-50 rounded-xl text-primary-600 border shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Security Credentials</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage your student passcode configurations.</p>
            </div>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-4 pt-2">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              disabled
              className="bg-slate-50 cursor-not-allowed"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-50">
              <Button type="submit" variant="secondary" className="font-semibold text-xs py-2">
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Notification preferences Card */}
        <Card className="p-6 md:p-8 space-y-5 text-left border border-slate-100 shadow-premium bg-white">
          <div className="flex items-center space-x-3 border-b border-slate-50 pb-3 shrink-0">
            <div className="p-2 bg-primary-50 rounded-xl text-primary-600 border shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Collaboration Notifications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Toggle notification triggers for teammates discovery matching.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-700 block">Email Alerts</span>
                <span className="text-[10px] text-slate-400 block">Receive invitations and matchmaking notifications directly in email.</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-700 block">Browser Push Notifications</span>
                <span className="text-[10px] text-slate-400 block">Pop up direct chat indicators during real-time sprint sessions.</span>
              </div>
            </label>
          </div>
        </Card>
      </div>

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

    </div>
  );
};
export default Settings;
