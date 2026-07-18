import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, Timer } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { Sidebar } from '../components/Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

export default function Focus() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('genz_tasks');
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
    
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('genz_tasks');
        if (saved) setTasks(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('tasks_updated', handleSync);
    return () => window.removeEventListener('tasks_updated', handleSync);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] flex overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 glass-card rounded-none border-b border-[var(--card-border)] flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-4 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)] lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold gradient-text hidden sm:block">Focus & Productivity</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Timer className="text-violet-500" />
                  Productivity Zone
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your focus sessions and track your daily streak.</p>
              </div>
            </div>

            <div className="max-w-2xl">
              <PomodoroTimer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
