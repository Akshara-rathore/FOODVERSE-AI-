import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'coral';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />,
    coral: <AlertTriangle className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />,
  }[variant];

  const variantStyles = {
    info: 'bg-primary-light/50 border-primary/20 text-mainText',
    success: 'bg-success-light/60 border-success/30 text-mainText',
    warning: 'bg-warning-light/70 border-warning/30 text-mainText',
    error: 'bg-error-light/60 border-error/30 text-mainText',
    coral: 'bg-coral-light/60 border-coral/30 text-mainText',
  }[variant];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${variantStyles} ${className}`}>
      {icons}
      <div className="flex-1 text-xs md:text-sm">
        {title && <h4 className="font-heading font-semibold mb-0.5">{title}</h4>}
        <div className="leading-relaxed opacity-95">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-secondaryText hover:text-mainText transition-colors p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
