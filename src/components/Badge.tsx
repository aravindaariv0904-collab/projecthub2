import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-100',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    danger: 'bg-red-50 text-red-700 border border-red-100',
    info: 'bg-blue-50 text-blue-700 border border-blue-100',
    neutral: 'bg-slate-50 text-slate-600 border border-slate-100'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] tracking-wide',
    md: 'px-2.5 py-1 text-xs'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
