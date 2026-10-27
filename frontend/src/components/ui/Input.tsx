import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-secondaryText mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-secondaryText pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-10 bg-white border ${
              error ? 'border-error focus:ring-error' : 'border-border focus:ring-primary focus:border-primary'
            } rounded-lg text-sm text-mainText placeholder-secondaryText/60 px-3.5 ${
              icon ? 'pl-9' : ''
            } transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-20 disabled:bg-gray-50 disabled:text-secondaryText/60 ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-error mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-secondaryText mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
