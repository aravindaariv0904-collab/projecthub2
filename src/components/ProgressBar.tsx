import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min(Math.max(0, value), 100);

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-500">
          <span>Progress</span>
          <span className="text-slate-700">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="bg-primary-600 rounded-full h-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
