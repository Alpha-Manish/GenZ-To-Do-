import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Award, Flame, Menu, Bell } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { HabitCard } from '../components/HabitCard';
import { HabitForm } from '../components/HabitForm';
import { Sidebar } from '../components/Sidebar';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Habits() {
  const { habits, completions, addHabit, removeHabit, logCompletion } = useHabits();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Derived Stats
  const activeHabits = habits.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => {
    if (h.frequency !== 'daily') return false; // simplify stats to daily for now
    const c = completions.find(comp => comp.habitId === h.id && comp.date === todayStr);
    return c && c.count >= h.target;
  }).length;
  
  const dailyHabitsCount = habits.filter(h => h.frequency === 'daily').length;
  const perfectDay = dailyHabitsCount > 0 && completedToday === dailyHabitsCount;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
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

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 glass-card rounded-none border-b border-[var(--card-border)] flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-4 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)] lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold gradient-text hidden sm:block">Habits Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-[var(--card-bg)] text-gray-600 dark:text-gray-300 transition-colors">
              <Bell size={20} />
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold gradient-text tracking-tight mb-2">Habits</h2>
                <p className="text-[var(--foreground)] opacity-70">Build better routines, one day at a time.</p>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="primary-button flex items-center justify-center space-x-2"
              >
                <Plus size={20} />
                <span>Create Habit</span>
              </button>
            </header>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-500">
                  <Target size={24} />
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)] opacity-70">Active Habits</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{activeHabits}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)] opacity-70">Completed Today</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {completedToday} / {dailyHabitsCount}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <Flame size={24} />
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)] opacity-70">Perfect Day</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{perfectDay ? 'Yes!' : 'Not yet'}</p>
                </div>
              </motion.div>
            </div>

            {/* Habits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  completions={completions.filter(c => c.habitId === habit.id)}
                  onLog={(id) => logCompletion(id, todayStr, 1)}
                  onUndo={(id) => logCompletion(id, todayStr, -1)}
                  onDelete={removeHabit}
                />
              ))}
              {habits.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-[var(--card-border)] rounded-2xl bg-[var(--card-bg)]">
                  <div className="w-16 h-16 bg-[var(--card-border)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--foreground)] opacity-50">
                    <Target size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">No habits yet</h3>
                  <p className="text-[var(--foreground)] opacity-60 mb-6 max-w-md mx-auto">
                    Start your journey by creating a new habit to track your daily routines and achieve your goals.
                  </p>
                  <button onClick={() => setIsFormOpen(true)} className="glass-button text-violet-500">
                    Create First Habit
                  </button>
                </div>
              )}
            </div>

            <HabitForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onAdd={addHabit}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
