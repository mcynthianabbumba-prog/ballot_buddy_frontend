import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle, onMenuClick }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('welcomeMessage');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-pink-100 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Menu Button & Title */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: User Info & Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-gray-500">
                  {user.role === 'ADMIN' ? 'Administrator' : user.role === 'OFFICER' ? 'Returning Officer' : 'Candidate'}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <svg className="w-4 h-4 text-gray-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/50 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-200/50">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
