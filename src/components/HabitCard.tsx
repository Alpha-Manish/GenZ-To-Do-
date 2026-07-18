import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Trash2, Dumbbell, BookOpen, Code, Activity, RotateCcw } from 'lucide-react';
import type { Habit, HabitCompletion } from '../types/habit';
import { HabitCalendar } from './HabitCalendar';

interface HabitCardProps {
  habit: Habit;
  completions: HabitCompletion[];
  onLog: (habitId: string) => void;
  onUndo: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

const CategoryIcon = ({ category, color }: { category: string; color: string }) => {
  const props = { size: 24, color };
  switch (category) {
    case 'Exercise': return <Dumbbell {...props} />;
    case 'Reading': return <BookOpen {...props} />;
    case 'Coding': return <Code {...props} />;
    default: return <Activity {...props} />;
  }
};

export function HabitCard({ habit, completions, onLog, onUndo, onDelete }: HabitCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate progress
  const todayStr = new Date().toISOString().split('T')[0];
  
  // A simple implementation of progress: just how many completions today vs target (if daily)
  // Or in current period (if weekly/monthly). For simplicity, just sum recent completions for the target period.
  let currentCount = 0;
  if (habit.frequency === 'daily') {
    currentCount = completions.find(c => c.date === todayStr)?.count || 0;
  } else if (habit.frequency === 'weekly') {
    // simplified: last 7 days
    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });
    currentCount = completions.filter(c => last7Days.includes(c.date)).reduce((sum, c) => sum + c.count, 0);
  } else if (habit.frequency === 'monthly') {
    // simplified: last 30 days
    const last30Days = Array.from({length: 30}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });
    currentCount = completions.filter(c => last30Days.includes(c.date)).reduce((sum, c) => sum + c.count, 0);
  }

  const progressPercentage = Math.min((currentCount / habit.target) * 100, 100);
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <motion.div layout className="glass-card p-5 relative group overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Background Ring */}
            <svg className="w-16 h-16 transform -rotate-90 absolute">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="var(--card-border)"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress Ring */}
              <motion.circle
                cx="32"
                cy="32"
                r={radius}
                stroke={habit.color}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="z-10 bg-[var(--background)] rounded-full p-2">
              <CategoryIcon category={habit.category} color={habit.color} />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--foreground)] text-lg">{habit.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentCount} / {habit.target} {habit.frequency}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentCount > 0 && (
            <button
              onClick={() => onUndo(habit.id)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm transform hover:scale-110 active:scale-95 bg-[var(--card-bg)] text-[var(--foreground)] hover:text-red-500"
              style={{ border: `1px solid var(--card-border)` }}
              title="Undo"
            >
              <RotateCcw size={18} />
            </button>
          )}

          <button
            onClick={() => {
              if (currentCount < habit.target) {
                onLog(habit.id);
              }
            }}
            disabled={currentCount >= habit.target}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm transform ${currentCount >= habit.target ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
            style={{ 
              backgroundColor: progressPercentage >= 100 ? habit.color : 'var(--card-bg)',
              color: progressPercentage >= 100 ? 'white' : 'var(--foreground)',
              border: `1px solid ${habit.color}40`
            }}
          >
            <Check size={20} />
          </button>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--card-border)] text-[var(--foreground)] transition-colors"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          <button
            onClick={() => onDelete(habit.id)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/10 text-red-500 transition-colors"
            title="Delete Habit"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <HabitCalendar completions={completions} color={habit.color} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
