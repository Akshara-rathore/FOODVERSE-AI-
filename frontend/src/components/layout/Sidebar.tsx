import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Scan,
  ShieldCheck,
  UtensilsCrossed,
  ChefHat,
  CalendarDays,
  Sparkles,
  History,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Food Scanner', to: '/food-scanner', icon: Scan },
    { label: 'Freshness Checker', to: '/freshness', icon: ShieldCheck },
    { label: 'Kitchen Hygiene', to: '/hygiene', icon: UtensilsCrossed },
    { label: 'Cooking Assistant', to: '/cooking', icon: ChefHat },
    { label: 'Meal Planner', to: '/meal-planner', icon: CalendarDays },
    { label: 'AI Assistant', to: '/assistant', icon: Sparkles },
    { label: 'History', to: '/history', icon: History },
    { label: 'Profile & Settings', to: '/profile', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-darkNav text-white select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md relative overflow-hidden">
            <span className="font-heading font-black text-lg text-white">F</span>
            <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-coral"></span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              FoodVerse <span className="text-[10px] bg-primary px-1.5 py-0.5 rounded text-white font-semibold tracking-wider">AI</span>
            </h1>
            <p className="text-[11px] text-gray-400 font-normal">Intelligent Food Platform</p>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-darkNav-active text-white border-l-4 border-secondary shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-darkNav-hover'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0 text-secondary" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section at Bottom */}
      <div className="p-4 border-t border-white/10 bg-darkNav-hover/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-primary/40 border border-primary/60 flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
              {user?.name ? user.name.slice(0, 2) : 'FV'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email || 'user@foodverse.ai'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-gray-400 hover:text-coral transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-darkNav/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-72 z-50 md:hidden transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
