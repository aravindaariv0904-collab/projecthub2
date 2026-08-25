import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
  borderStyle?: 'thin' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padded = true,
  borderStyle = 'thin',
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-premium overflow-hidden transition-all duration-200';
  const borderStyles = borderStyle === 'thin' ? 'border border-slate-100' : '';
  const hoverStyles = hoverable ? 'hover:shadow-premium-hover hover:border-slate-200 hover:-translate-y-0.5' : '';
  const paddingStyles = padded ? 'p-5 md:p-6' : '';

  return (
    <div
      className={`${baseStyles} ${borderStyles} ${hoverStyles} ${paddingStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
