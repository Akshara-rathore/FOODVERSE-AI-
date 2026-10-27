import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 border-2 border-dashed border-border rounded-xl bg-surface/60 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-heading font-semibold text-base md:text-lg text-mainText mb-1">{title}</h3>
      <p className="text-xs md:text-sm text-secondaryText max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
