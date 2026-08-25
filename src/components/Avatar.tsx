import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  score?: number; // Show collaboration score border/ring helper
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  score,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base font-semibold',
    xl: 'h-20 w-20 text-2xl font-semibold'
  };

  const getInitials = (userName: string) => {
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  // Border coloring based on collaboration score
  const getScoreRing = (scoreVal?: number) => {
    if (!scoreVal) return 'border-slate-200';
    if (scoreVal >= 95) return 'ring-2 ring-emerald-500 ring-offset-1';
    if (scoreVal >= 90) return 'ring-2 ring-primary-500 ring-offset-1';
    return 'ring-2 ring-amber-500 ring-offset-1';
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-slate-100 font-medium text-slate-600 border border-slate-200 shadow-sm shrink-0 ${sizes[size]} ${
        score ? getScoreRing(score) : ''
      } ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
