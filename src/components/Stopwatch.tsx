import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export function Stopwatch() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(() => {
    try {
      const saved = localStorage.getItem('genz_stopwatch');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 0;
  });

  useEffect(() => {
    localStorage.setItem('genz_stopwatch', time.toString());
  }, [time]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const h = Math.floor(m / 60);
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((time % 60) / 60) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const timeStr = formatTime(time);
  const timeSizeClass = timeStr.length > 5 ? 'text-4xl' : 'text-5xl';

  return (
    <div className="glass-card p-6 min-h-[400px] relative overflow-hidden group border border-blue-500/20 flex flex-col items-center justify-center w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-colors duration-500"></div>

      <div className="absolute top-6 left-6 flex items-center z-10">
        <div className="px-3 py-1.5 rounded-full bg-[var(--background)] border border-[var(--card-border)] text-xs font-semibold text-[var(--foreground)] shadow-sm flex items-center gap-1.5">
          <Clock size={14} className="text-blue-500" />
          Stopwatch
        </div>
      </div>

      <div className="text-center mb-8 mt-2">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center gap-2">
          Task Stopwatch
        </h3>
      </div>

      <div className="relative flex items-center justify-center w-56 h-56 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-800"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="url(#stopwatch-gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "linear" }}
          />
          <defs>
            <linearGradient id="stopwatch-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`${timeSizeClass} font-bold text-[var(--foreground)] tabular-nums tracking-tight transition-all`}>
            {timeStr}
          </span>
          <span className="text-sm text-gray-500 mt-2 uppercase tracking-widest font-semibold">
            {isActive ? 'Running' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={toggleTimer}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-gray-500 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all hover:scale-105 active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}
