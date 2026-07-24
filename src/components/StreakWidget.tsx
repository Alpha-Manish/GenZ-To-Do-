import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { getStreakData } from '../utils/streakUtils';
import { useAuth } from '../context/AuthContext';

interface StreakWidgetProps {
  tasks?: any[]; 
}

export function StreakWidget({ tasks }: StreakWidgetProps) {
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const loadDates = async () => {
      const data = await getStreakData(currentUser.uid);
      setActiveDates(new Set(data.activeDates));
    };
    loadDates();
    window.addEventListener('streak_updated', loadDates);
    return () => {
      window.removeEventListener('streak_updated', loadDates);
    };
  }, [currentUser]);

  const today = new Date();
  const days: Date[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  const firstDay = days[0].getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null as any);
  }

  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null as any);
    }
    weeks.push(currentWeek);
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="glass-card p-6 relative overflow-hidden group flex flex-col h-full min-h-[400px]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -z-10 group-hover:bg-violet-500/20 transition-colors duration-500"></div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold gradient-text flex items-center gap-2">
          <Activity className="text-violet-500" size={20} />
          Activity Graph
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Total active days: <span className="text-[var(--foreground)] font-bold">{activeDates.size}</span>
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-max flex flex-col gap-1.5 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 border border-[var(--card-border)]">
            <div className="flex text-xs text-gray-500 font-medium ml-8">
              {weeks.map((week, i) => {
                const day = week.find(d => d);
                if (day && day.getDate() <= 7 && i % 4 === 0) {
                  return (
                    <div key={i} className="relative" style={{ width: '14px', marginRight: '4px' }}>
                      <span className="absolute -left-2 top-0 whitespace-nowrap">{months[day.getMonth()]}</span>
                    </div>
                  );
                }
                return <div key={i} style={{ width: '14px', marginRight: '4px' }}></div>;
              })}
            </div>
            
            <div className="flex gap-1">
              <div className="flex flex-col gap-[6px] text-[10px] text-gray-500 font-medium mr-2 justify-between py-1">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
              
              {weeks.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-[6px]">
                  {week.map((day, dIndex) => {
                    if (!day) return <div key={dIndex} className="w-3.5 h-3.5 bg-transparent"></div>;
                    
                    const dateStr = day.toISOString().split('T')[0];
                    const isActive = activeDates.has(dateStr);
                    const tooltipText = `${day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}${isActive ? ' (Active)' : ''}`;
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (wIndex * 0.01) + (dIndex * 0.005) }}
                        key={dIndex} 
                        title={tooltipText}
                        className={`w-3.5 h-3.5 rounded-sm transition-colors duration-300 ${
                          isActive 
                            ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]' 
                            : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
