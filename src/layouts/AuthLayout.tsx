import React from 'react';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-2xl text-white shadow-premium mb-4">
          <Sparkles className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          PROJECTHUB
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
          Turn your idea into a real project with the right people.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-100 shadow-premium rounded-2xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
