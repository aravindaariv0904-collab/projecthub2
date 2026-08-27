import React from 'react';
import { Card } from '../../components/Card';
import { Bell } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
          Stay updated with connection requests, applications, and messaging activity.
        </p>
      </div>

      <Card padded className="flex flex-col items-center justify-center text-center py-12">
        <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
          <Bell className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Notifications Feed Loading</h3>
        <p className="text-slate-500 text-xs leading-relaxed max-w-sm mt-1">
          This feature will be fully implemented in a later phase. You will see real-time student connect updates, invitations, and message alerts here.
        </p>
      </Card>
    </div>
  );
};

export default NotificationsPage;
