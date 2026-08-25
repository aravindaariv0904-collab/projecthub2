import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 max-w-md mx-auto ${className}`}>
      {icon && (
        <div className="flex items-center justify-center p-3.5 bg-white shadow-premium border border-slate-100 rounded-xl mb-4 text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
