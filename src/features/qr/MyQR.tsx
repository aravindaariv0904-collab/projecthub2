import React from 'react';
import { Card } from '../../components/Card';
import { QrCode } from 'lucide-react';

export const MyQR: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My QR Code</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
          Share your public ProjectHub connect card.
        </p>
      </div>

      <Card padded className="flex flex-col items-center justify-center text-center py-12">
        <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
          <QrCode className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">QR Code Connect Card Loading</h3>
        <p className="text-slate-500 text-xs leading-relaxed max-w-sm mt-1">
          This feature will be fully implemented in Phase 4. You will be able to generate, view, and share your personal profile QR connect card.
        </p>
      </Card>
    </div>
  );
};

export default MyQR;
