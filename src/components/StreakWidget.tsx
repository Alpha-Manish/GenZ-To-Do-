import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star, Medal, Award } from 'lucide-react';

import { getStreakData, calculateCurrentStreak, calculateMaxStreak, StreakData } from '../utils/streakUtils';

interface StreakWidgetProps {
  tasks?: any[]; // Kept for backwards compatibility if passed, but not needed
}

export function StreakWidget({ tasks }: StreakWidgetProps) {
  const [streakData, setStreakData] = useState<StreakData>(getStreakData());

  useEffect(() => {
    const handleStreakSync = () => {
      setStreakData(getStreakData());
    };
    
    window.addEventListener('storage', handleStreakSync);
    window.addEventListener('streak_updated', handleStreakSync);
    
    return () => {
      window.removeEventListener('storage', handleStreakSync);
      window.removeEventListener('streak_updated', handleStreakSync);
    };
  }, []);

  const currentStreak = calculateCurrentStreak(streakData.activeDates);
  const maxTemp = calculateMaxStreak(streakData.activeDates);
  const longest = Math.max(streakData.longestStreak, currentStreak, maxTemp);

  const achievements = [
    { days: 3, title: 'Starter', icon: Star, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { days: 7, title: 'Week Warrior', icon: Medal, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { days: 30, title: 'Monthly Master', icon: Trophy, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
    { days: 100, title: 'Century Club', icon: Award, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ];

  const currentAchievement = achievements.slice().reverse().find(a => longest >= a.days);
  const nextAchievement = achievements.find(a => longest < a.days);
  const progressToNext = nextAchievement 
    ? (longest / nextAchievement.days) * 100 
    : 100;

  return (
    <div className="glass-card p-6 relative overflow-hidden group border border-orange-500/20 flex flex-col h-full min-h-[400px]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -z-10 group-hover:bg-orange-500/20 transition-colors duration-500"></div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold gradient-text flex items-center gap-2">
          <Flame className="text-orange-500" size={20} />
          Streak System
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div 
          key={currentStreak}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex items-center justify-center mb-4"
        >
          <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full"></div>
          <div className="relative bg-gradient-to-tr from-orange-100 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/40 w-32 h-32 rounded-full flex flex-col items-center justify-center border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
            <Flame className="text-orange-500 mb-1" size={32} />
            <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter">
              {currentStreak}
            </span>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Days</span>
          </div>
        </motion.div>

        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
          Longest Streak: <span className="text-[var(--foreground)] font-bold">{longest} days</span>
        </p>

        {/* Achievement Badge */}
        {currentAchievement && (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`mt-6 px-4 py-2 rounded-xl flex items-center gap-3 border ${currentAchievement.bg} ${currentAchievement.border}`}
          >
            <div className={`p-1.5 rounded-lg bg-[var(--background)] ${currentAchievement.color} shadow-sm`}>
              <currentAchievement.icon size={18} />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${currentAchievement.color}`}>
                Achievement Unlocked
              </p>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {currentAchievement.title}
              </p>
            </div>
          </motion.div>
        )}

        {/* Progress to next */}
        {nextAchievement && (
          <div className="w-full mt-6">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-gray-500">Next: {nextAchievement.title}</span>
              <span className="text-[var(--foreground)]">{longest} / {nextAchievement.days}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
