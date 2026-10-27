import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, action, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-border rounded-xl shadow-subtle p-5 md:p-6 transition-all ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-border/70">
          <div>
            {title && <h3 className="font-heading font-semibold text-lg text-mainText">{title}</h3>}
            {subtitle && <p className="text-xs text-secondaryText mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
