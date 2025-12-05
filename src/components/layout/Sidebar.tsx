import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { cn } from '../../lib/utils';

interface SidebarProps {
  role: 'ADMIN' | 'OFFICER' | 'CANDIDATE';
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNavAction?: (action: string) => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  roles: ('ADMIN' | 'OFFICER' | 'CANDIDATE')[];
}

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, setIsOpen, onNavAction }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: role === 'ADMIN' ? '/admin/dashboard' : role === 'OFFICER' ? '/officer/dashboard' : '/candidate/dashboard',
      roles: ['ADMIN', 'OFFICER', 'CANDIDATE'],
    },
    {
      label: 'Positions',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/admin/dashboard#positions',
      roles: ['ADMIN'],
    },
    {
      label: 'Candidates',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/admin/dashboard#candidates',
      roles: ['ADMIN', 'OFFICER'],
    },
    {
      label: 'Nominations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/officer/dashboard',
      roles: ['OFFICER'],
    },
    {
      label: 'Audit Log',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/admin/dashboard#audit',
      roles: ['ADMIN'],
    },
    {
      label: 'Voters',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: '/admin/dashboard#voters',
      roles: ['ADMIN'],
    },
    {
      label: 'Officers',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: '/admin/dashboard#officers',
      roles: ['ADMIN'],
    },
    {
      label: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/admin/reports',
      roles: ['ADMIN'],
    },
    {
      label: 'My Nominations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/candidate/dashboard',
      roles: ['CANDIDATE'],
    },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  const handleNavClick = (item: NavItem) => {
    // For route-based navigation (reports), navigate directly
    if (item.path.startsWith('/admin/reports')) {
      navigate(item.path);
      return;
    }
    
    // For dashboard with hash, navigate with hash for modal triggers
    if (item.path.includes('#')) {
      navigate(item.path);
      // Trigger action after a brief delay to allow navigation
      setTimeout(() => {
        if (onNavAction) {
          const actionMap: { [key: string]: string } = {
            'Positions': 'open-positions-list',
            'Candidates': 'open-candidates-list',
            'Voters': 'open-voters-list',
            'Officers': 'open-officers-list',
            'Audit Log': 'open-audit-log',
          };
          const action = actionMap[item.label];
          if (action) {
            onNavAction(action);
          }
        }
      }, 100);
      return;
    }
    
    // For regular dashboard navigation
    if (item.path.includes('/dashboard')) {
      navigate(item.path);
      return;
    }
    
    // Fallback: navigate
    navigate(item.path);
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    const itemPath = path.split('#')[0]; // Remove hash for comparison
    
    // For reports page - exact match
    if (path === '/admin/reports' && currentPath === '/admin/reports') {
      return true;
    }
    
    // For dashboard items - check if we're on the dashboard page
    // Only mark active if it's the main dashboard route (no hash)
    if (path === '/admin/dashboard' || path === '/officer/dashboard' || path === '/candidate/dashboard') {
      return currentPath === path && !location.hash;
    }
    
    // For hash-based navigation items, don't mark as active
    // They will be handled via modals, not as active routes
    if (path.includes('#')) {
      return false;
    }
    
    // Default: exact path match
    return currentPath === itemPath;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-50 bg-white border-r border-pink-100 shadow-sm transition-all duration-300 ease-in-out',
          isOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100 h-16 bg-pink-50/30">
          {isOpen ? (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Logo size="sm" showText={false} />
              <div className="min-w-0">
                <h2 className="font-bold text-lg text-pink-600 truncate">
                  BALLOT BUDDY
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {role === 'ADMIN' ? 'Admin' : role === 'OFFICER' ? 'Officer' : 'Candidate'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <Logo size="sm" showText={false} />
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {filteredNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative group',
                  active
                    ? 'bg-pink-50 text-pink-700 shadow-sm border border-pink-200'
                    : 'text-gray-700 hover:bg-pink-50/50 hover:text-pink-600 border-transparent',
                  !isOpen && 'justify-center px-2'
                )}
              >
                <div
                  className={cn(
                    'flex-shrink-0',
                    active ? 'text-pink-600' : 'text-gray-500 group-hover:text-pink-600'
                  )}
                >
                  {item.icon}
                </div>
                {isOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-bold rounded-full bg-pink-100 text-pink-700">
                        {item.badge}
                      </span>
                    )}
                    {active && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-600 rounded-l-full" />
                    )}
                  </>
                )}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
