import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'coral' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
  }[size];

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-sm active:scale-[0.99]',
    secondary: 'bg-primary-light text-primary hover:bg-purple-100 focus:ring-secondary active:scale-[0.99]',
    coral: 'bg-coral text-white hover:bg-coral-dark focus:ring-coral shadow-sm active:scale-[0.99]',
    outline: 'border border-border bg-white text-mainText hover:bg-gray-50 focus:ring-primary',
    ghost: 'text-secondaryText hover:text-mainText hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-error text-white hover:bg-red-700 focus:ring-error shadow-sm',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
      <span>{children}</span>
    </button>
  );
};
