import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  textarea?: boolean;
  rows?: number;
}

// Separate type for textarea support
type CombinedProps = InputProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof InputProps>;

export const Input: React.FC<CombinedProps> = ({
  label,
  error,
  helperText,
  textarea = false,
  rows = 3,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const baseInputStyles = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:bg-slate-50 transition-all duration-200';
  const errorStyles = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';

  return (
    <div className={`w-full text-left ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          id={inputId}
          rows={rows}
          className={`${baseInputStyles} ${errorStyles}`}
          {...(props as any)}
        />
      ) : (
        <input
          id={inputId}
          className={`${baseInputStyles} ${errorStyles}`}
          {...(props as any)}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
