import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { DemoSwitcher } from '../components/DemoSwitcher';
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  Users, 
  Trophy, 
  MessageSquare, 
  ShieldCheck, 
  Bookmark, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  LogOut,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    logout,
    projects,
    students,
    hackathons,
    communities
  } = useApp();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Project Board', path: '/projects', icon: <Briefcase className="h-5 w-5" /> },
    { name: 'Discover', path: '/discover', icon: <Compass className="h-5 w-5" /> },
    { name: 'My Projects', path: '/my-projects', icon: <Briefcase className="h-5 w-5" /> },
    { name: 'Find Teammates', path: '/team-builder', icon: <Users className="h-5 w-5" /> },
    { name: 'Hackathons', path: '/hackathons', icon: <Trophy className="h-5 w-5" /> },
    { name: 'Communities', path: '/communities', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Reputation', path: '/reputation', icon: <ShieldCheck className="h-5 w-5" /> },
    { name: 'Bookmarks', path: '/bookmarks', icon: <Bookmark className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> }
  ];

  const unreadNotifs = notifications.filter(n => !n.isRead);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const query = searchQuery.trim().toLowerCase();
  const searchResults = query ? {
    projects: projects.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)).slice(0, 3),
    students: students.filter(s => s.name.toLowerCase().includes(query) || s.course.toLowerCase().includes(query)).slice(0, 3),
    hackathons: hackathons.filter(h => h.name.toLowerCase().includes(query) || h.theme.toLowerCase().includes(query)).slice(0, 3),
    communities: communities.filter(c => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)).slice(0, 3)
  } : { projects: [], students: [], hackathons: [], communities: [] };

  const hasResults = searchQuery.trim() && (
    searchResults.projects.length > 0 ||
    searchResults.students.length > 0 ||
    searchResults.hackathons.length > 0 ||
    searchResults.communities.length > 0
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* 1. Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Left Sidebar (Desktop & Collapsible Mobile) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
            <div className="bg-primary-600 p-1.5 rounded-lg text-white shadow-premium">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              PROJECTHUB
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-primary-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.name}</span>
                {item.name === 'Messages' && (
                  <Badge variant="primary" size="sm" className="ml-auto font-semibold">
                    1
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Profile Panel */}
        {currentUser && (
          <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
            <div className="flex items-center space-x-3 mb-3">
              <Link to="/profile">
                <Avatar src={currentUser.avatarUrl} name={currentUser.name} score={currentUser.collaborationScore} size="sm" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.college}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold rounded-lg transition-colors border border-transparent"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </aside>

      {/* 3. Right Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
          
          {/* Hamburger + Brand (Mobile only) */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1 text-slate-500 hover:text-slate-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-1.5">
              <div className="bg-primary-600 p-1.5 rounded-lg text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-slate-900">PROJECTHUB</span>
            </Link>
          </div>

          {/* Global Search Bar (Desktop/Tablet) */}
          <div className="hidden md:block relative w-full max-w-sm">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search students, projects, hackathons..."
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              />
            </form>
            
            {showSearchDropdown && hasResults && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSearchDropdown(false)} />
                <div className="absolute left-0 mt-2 w-[340px] bg-white border border-slate-200 shadow-2xl rounded-xl py-3 z-50 max-h-[350px] overflow-y-auto font-sans text-left text-slate-800">
                  <div className="px-4 pb-2 border-b border-slate-50 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Instant Results</span>
                    <button onClick={() => setShowSearchDropdown(false)} className="hover:text-slate-600 font-bold uppercase text-[9px]">Close</button>
                  </div>
                  
                  <div className="p-2 space-y-3">
                    {/* Projects Section */}
                    {searchResults.projects.length > 0 && (
                      <div>
                        <span className="text-[9px] uppercase font-bold text-primary-600 px-2 block tracking-wider mb-1">Projects</span>
                        {searchResults.projects.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setShowSearchDropdown(false);
                              navigate(`/discover?search=${encodeURIComponent(p.name)}`);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs font-semibold block truncate transition-colors text-slate-700"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Students Section */}
                    {searchResults.students.length > 0 && (
                      <div>
                        <span className="text-[9px] uppercase font-bold text-emerald-600 px-2 block tracking-wider mb-1">Students</span>
                        {searchResults.students.map(s => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setShowSearchDropdown(false);
                              navigate(`/team-builder`);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs font-semibold flex items-center space-x-2 transition-colors text-slate-700"
                          >
                            <Avatar src={s.avatarUrl} name={s.name} size="xs" />
                            <div className="min-w-0">
                              <span className="block truncate leading-tight">{s.name}</span>
                              <span className="text-[9px] text-slate-400 block leading-none">{s.course}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Hackathons Section */}
                    {searchResults.hackathons.length > 0 && (
                      <div>
                        <span className="text-[9px] uppercase font-bold text-amber-600 px-2 block tracking-wider mb-1">Hackathons</span>
                        {searchResults.hackathons.map(h => (
                          <button
                            key={h.id}
                            onClick={() => {
                              setShowSearchDropdown(false);
                              navigate(`/hackathons`);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs font-semibold block truncate transition-colors text-slate-700"
                          >
                            {h.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Controls Panel */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Search Toggle (Mobile only) */}
            <button 
              onClick={() => navigate('/discover')}
              className="p-1.5 text-slate-500 hover:text-slate-700 md:hidden hover:bg-slate-50 rounded-lg"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg relative transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>

              {notifDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 shadow-2xl rounded-xl py-2 z-50 fade-in-up text-left">
                    <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                      {unreadNotifs.length > 0 && (
                        <button 
                          onClick={markAllNotificationsRead}
                          className="text-[10px] text-primary-600 hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            onClick={() => {
                              markNotificationRead(notif.id);
                              if (notif.projectId) navigate(`/my-projects?id=${notif.projectId}`);
                              else if (notif.senderId) navigate(`/profile?id=${notif.senderId}`);
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors flex items-start space-x-2.5 ${
                              !notif.isRead ? 'bg-slate-50/50 font-medium' : ''
                            }`}
                          >
                            <span className="h-2 w-2 mt-1.5 shrink-0 rounded-full bg-primary-500 opacity-80" />
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-800 leading-normal">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <Link to="/profile" className="flex items-center space-x-2 focus:outline-none">
              {currentUser && (
                <>
                  <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" />
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 hover:text-slate-900">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </>
              )}
            </Link>
          </div>
        </header>

        {/* Scrollable Workspace Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

        {/* 4. Mobile Bottom Navigation Bar (Visible only on screens < lg) */}
        <nav className="h-14 bg-white border-t border-slate-100 flex items-center justify-around px-2 shrink-0 lg:hidden z-30">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center p-1 text-slate-400 ${
              location.pathname === '/' ? 'text-primary-600 font-semibold' : ''
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[9px] mt-0.5">Dashboard</span>
          </Link>
          <Link 
            to="/discover" 
            className={`flex flex-col items-center justify-center p-1 text-slate-400 ${
              location.pathname.startsWith('/discover') ? 'text-primary-600 font-semibold' : ''
            }`}
          >
            <Compass className="h-5 w-5" />
            <span className="text-[9px] mt-0.5">Discover</span>
          </Link>
          <Link 
            to="/my-projects" 
            className={`flex flex-col items-center justify-center p-1 text-slate-400 ${
              location.pathname.startsWith('/my-projects') ? 'text-primary-600 font-semibold' : ''
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-[9px] mt-0.5">Projects</span>
          </Link>
          <Link 
            to="/messages" 
            className={`flex flex-col items-center justify-center p-1 text-slate-400 relative ${
              location.pathname.startsWith('/messages') ? 'text-primary-600 font-semibold' : ''
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[9px] mt-0.5">Messages</span>
          </Link>
          <Link 
            to="/profile" 
            className={`flex flex-col items-center justify-center p-1 text-slate-400 ${
              location.pathname.startsWith('/profile') ? 'text-primary-600 font-semibold' : ''
            }`}
          >
            {currentUser ? (
              <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="xs" className="border border-slate-200" />
            ) : (
              <Users className="h-5 w-5" />
            )}
            <span className="text-[9px] mt-0.5">Profile</span>
          </Link>
        </nav>
        <DemoSwitcher />
      </div>
    </div>
  );
};
