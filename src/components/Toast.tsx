import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const backgrounds = {
    success: 'bg-emerald-900 border border-emerald-800 text-white shadow-xl',
    error: 'bg-red-950 border border-red-900 text-white shadow-xl'
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex items-center space-x-3 px-4 py-3 rounded-xl max-w-sm fade-in-up md:right-8 md:bottom-8 select-none transition-all duration-300 transform border border-opacity-20 shadow-2xl bg-slate-900">
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="text-sm font-medium text-slate-100">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
