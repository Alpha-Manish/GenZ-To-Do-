import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, BarChart2, Settings, Timer, X, Flame, Repeat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStreakData, calculateCurrentStreak } from '../utils/streakUtils';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [avatar, setAvatar] = useState(() => localStorage.getItem('genz_user_avatar') || '');
  
  const [streakData, setStreakData] = useState(() => getStreakData());

  useEffect(() => {
    const handleAvatarSync = () => setAvatar(localStorage.getItem('genz_user_avatar') || '');
    window.addEventListener('avatar_updated', handleAvatarSync);
    
    // Also sync streak data in case it updates on another page
    const handleStreakSync = () => {
      setStreakData(getStreakData());
    };
    window.addEventListener('storage', handleStreakSync);
    window.addEventListener('streak_updated', handleStreakSync);

    return () => {
      window.removeEventListener('avatar_updated', handleAvatarSync);
      window.removeEventListener('storage', handleStreakSync);
      window.removeEventListener('streak_updated', handleStreakSync);
    };
  }, []);

  const navItems = [
    { name: 'Tasks', icon: CheckSquare, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'Focus', icon: Timer, path: '/focus' },
    { name: 'Habits', icon: Repeat, path: '/habits' },
    { name: 'Streak', icon: Flame, path: '/streak' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  // Calculate current streak
  const currentStreak = calculateCurrentStreak(streakData.activeDates);

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
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-card rounded-none border-r border-[var(--card-border)] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen flex flex-col ${
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

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
                {item.name === 'Streak' && currentStreak > 0 && (
                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
                    <Flame size={12} />
                    <span>{currentStreak}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--card-border)] shrink-0">
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[var(--card-bg)] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                currentUser?.email?.charAt(0) || 'U'
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">{currentUser?.email}</p>
              <button onClick={logout} className="text-xs text-red-500 hover:text-red-600">Sign out</button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
