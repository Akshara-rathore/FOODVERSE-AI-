import React, { useEffect, useState } from 'react';
import { Menu, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { SystemHealth } from '../../types';
import { Badge } from '../ui/Badge';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  title: string;
  description?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu, title, description }) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    api.getHealth().then(setHealth).catch(() => null);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-border sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden text-secondaryText hover:text-mainText p-2 -ml-2 rounded-lg"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-heading font-bold text-base md:text-lg text-mainText leading-tight">{title}</h2>
          {description && (
            <p className="hidden sm:block text-xs text-secondaryText">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {health?.ai_provider?.is_live_configured ? (
          <Badge variant="success" size="sm" dot>
            Live Gemini AI Active
          </Badge>
        ) : (
          <Badge variant="warning" size="sm" dot>
            Reference Mode
          </Badge>
        )}
      </div>
    </header>
  );
};
