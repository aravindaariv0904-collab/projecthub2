import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Pages imports
import { Dashboard } from './features/dashboard/Dashboard';
import { DiscoverProjects } from './features/projects/DiscoverProjects';
import { MyProjects } from './features/projects/MyProjects';
import { TeamBuilder } from './features/matchmaking/TeamBuilder';
import { Hackathons } from './features/hackathons/Hackathons';
import { Communities } from './features/communities/Communities';
import { Messages } from './features/messages/Messages';
import { Reputation } from './features/profile/Reputation';
import { Bookmarks } from './features/bookmarks/Bookmarks';
import { Settings } from './features/settings/Settings';
import { Profile } from './features/profile/Profile';
import { IdeaWizard } from './features/idea/IdeaWizard';

// Auth Pages imports
import { Login } from './features/auth/Login';
import { SignUp } from './features/auth/SignUp';
import { ForgotPassword } from './features/auth/ForgotPassword';

// Guard component that redirects to login if user session is missing
const ProtectedRoutes = () => {
  const { currentUser } = useApp();
  return currentUser ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Route wrapper for guest users (wrapping in AuthLayout)
const GuestRoutes = () => {
  const { currentUser } = useApp();
  return !currentUser ? (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ) : (
    <Navigate to="/" replace />
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Guest Auth routes */}
          <Route element={<GuestRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected student Dashboard routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/discover" element={<DiscoverProjects />} />
            <Route path="/my-projects" element={<MyProjects />} />
            <Route path="/team-builder" element={<TeamBuilder />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/reputation" element={<Reputation />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/idea/wizard" element={<IdeaWizard />} />
          </Route>

          {/* Catch-all fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
