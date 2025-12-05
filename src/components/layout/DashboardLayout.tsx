import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'ADMIN' | 'OFFICER' | 'CANDIDATE';
  title: string;
  subtitle?: string;
  onNavAction?: (action: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  title,
  subtitle,
  onNavAction,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar 
        role={role} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        onNavAction={onNavAction}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        {/* Top Bar */}
        <TopBar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;