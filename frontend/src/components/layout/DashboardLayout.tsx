import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, description }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      
      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <TopBar
          title={title}
          description={description}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
