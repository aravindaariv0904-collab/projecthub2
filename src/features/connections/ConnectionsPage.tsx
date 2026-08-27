import React from 'react';
import { Card } from '../../components/Card';
import { Users } from 'lucide-react';

export const ConnectionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Connections</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
          Manage your student network and connection requests.
        </p>
      </div>

      <Card padded className="flex flex-col items-center justify-center text-center py-12">
        <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
          <Users className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Connections Feature Loading</h3>
        <p className="text-slate-500 text-xs leading-relaxed max-w-sm mt-1">
          This feature will be fully implemented in a later phase. You will be able to review pending student requests and start chat sessions with connected peers.
        </p>
      </Card>
    </div>
  );
};

export default ConnectionsPage;
