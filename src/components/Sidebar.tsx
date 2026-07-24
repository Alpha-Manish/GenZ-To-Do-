import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, BarChart2, Settings, Timer, X, Repeat, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStreakData } from '../utils/streakUtils';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [avatar, setAvatar] = useState(() => localStorage.getItem('genz_user_avatar') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('genz_user_name') || '');
  
  const [streakData, setStreakData] = useState<any>({ activeDates: [], longestStreak: 0 });

  useEffect(() => {
    const handleAvatarSync = () => setAvatar(localStorage.getItem('genz_user_avatar') || '');
    const handleNameSync = () => setUserName(localStorage.getItem('genz_user_name') || '');
    window.addEventListener('avatar_updated', handleAvatarSync);
    window.addEventListener('name_updated', handleNameSync);
    
    if (currentUser) {
      getStreakData(currentUser.uid).then(setStreakData);
    }
    
    const handleStreakSync = () => {
      if (currentUser) {
        getStreakData(currentUser.uid).then(setStreakData);
      }
    };
    window.addEventListener('streak_updated', handleStreakSync);

    return () => {
      window.removeEventListener('avatar_updated', handleAvatarSync);
      window.removeEventListener('name_updated', handleNameSync);
      window.removeEventListener('streak_updated', handleStreakSync);
    };
  }, [currentUser]);

  const navItems = [
    { name: 'Tasks', icon: CheckSquare, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'Focus', icon: Timer, path: '/focus' },
    { name: 'Habits', icon: Repeat, path: '/habits' },
    { name: 'Activity', icon: Activity, path: '/streak' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--background)] border-r border-[var(--card-border)] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--card-border)] shrink-0">
          <span className="text-xl font-bold gradient-text tracking-wider">GenZ To-Do</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)]"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600/10 to-indigo-600/10 text-violet-600 dark:text-violet-400 font-medium' 
                    : 'text-[var(--foreground)] hover:bg-[var(--card-bg)]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} className={isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--card-border)] shrink-0">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-[var(--card-border)] transition-colors group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden shrink-0">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                (userName || currentUser?.displayName || currentUser?.email || 'U').charAt(0)
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-[var(--foreground)] truncate">
                {userName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {currentUser?.email}
              </p>
            </div>
            <button 
              onClick={logout} 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
