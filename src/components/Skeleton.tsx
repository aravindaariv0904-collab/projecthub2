import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width = '100%',
  height = '100%',
  className = ''
}) => {
  const getStyles = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  const variants = {
    text: 'h-4 w-3/4 rounded bg-slate-200',
    rect: 'rounded-xl bg-slate-200',
    circle: 'rounded-full bg-slate-200'
  };

  return (
    <div
      style={getStyles()}
      className={`animate-pulse ${variants[variant]} ${className}`}
    />
  );
};
