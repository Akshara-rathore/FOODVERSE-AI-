import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'coral' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  }[size];

  const variantStyles = {
    primary: 'bg-primary-light text-primary border border-primary/20',
    secondary: 'bg-secondary/15 text-secondary border border-secondary/20',
    coral: 'bg-coral-light text-coral border border-coral/20',
    success: 'bg-success-light text-success border border-success/20',
    warning: 'bg-warning-light text-warning border border-warning/20',
    error: 'bg-error-light text-error border border-error/20',
    neutral: 'bg-gray-100 text-secondaryText border border-border',
  }[variant];

  const dotColors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    coral: 'bg-coral',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    neutral: 'bg-gray-400',
  }[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles} ${variantStyles} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {children}
    </span>
  );
};
