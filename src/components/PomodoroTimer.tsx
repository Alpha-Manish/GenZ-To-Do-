import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Timer, Clock } from 'lucide-react';

const FOCUS_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

interface PomodoroState {
  timeLeft: number;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  sessionCount: number;
  isActive: boolean;
  isStopwatchMode: boolean;
  stopwatchTime: number;
}

export function PomodoroTimer() {
  const [state, setState] = useState<PomodoroState>(() => {
    try {
      const saved = localStorage.getItem('genz_pomodoro');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 
          ...parsed, 
          isActive: false, // Always load as paused
          isStopwatchMode: parsed.isStopwatchMode || false,
          stopwatchTime: parsed.stopwatchTime || 0
        };
      }
    } catch (e) {
      console.error('Failed to load pomodoro state', e);
    }
    return {
      timeLeft: FOCUS_TIME,
      mode: 'focus',
      sessionCount: 0,
      isActive: false,
      isStopwatchMode: false,
      stopwatchTime: 0
    };
  });

  // Save to local storage on state change
  useEffect(() => {
    localStorage.setItem('genz_pomodoro', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isActive) {
      if (state.isStopwatchMode) {
        interval = setInterval(() => {
          setState((prev) => ({ ...prev, stopwatchTime: prev.stopwatchTime + 1 }));
        }, 1000);
      } else {
        if (state.timeLeft > 0) {
          interval = setInterval(() => {
            setState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
          }, 1000);
        } else if (state.timeLeft === 0) {
          // Timer finished
          if (state.mode === 'focus') {
            const newSessionCount = state.sessionCount + 1;
            if (newSessionCount % 4 === 0) {
              setState({ ...state, mode: 'longBreak', timeLeft: LONG_BREAK_TIME, sessionCount: newSessionCount, isActive: false });
            } else {
              setState({ ...state, mode: 'shortBreak', timeLeft: SHORT_BREAK_TIME, sessionCount: newSessionCount, isActive: false });
            }
          } else {
            setState({ ...state, mode: 'focus', timeLeft: FOCUS_TIME, isActive: false });
          }
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isActive, state.timeLeft, state.mode, state.sessionCount, state.isStopwatchMode]);

  const toggleTimer = () => {
    setState((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetTimer = () => {
    setState(prev => ({
      ...prev,
      timeLeft: FOCUS_TIME,
      mode: 'focus',
      sessionCount: 0,
      isActive: false,
      stopwatchTime: 0
    }));
  };

  const toggleStopwatchMode = () => {
    setState(prev => ({
      ...prev,
      isStopwatchMode: !prev.isStopwatchMode,
      isActive: false
    }));
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

  const getTotalTime = () => {
    if (state.mode === 'focus') return FOCUS_TIME;
    if (state.mode === 'shortBreak') return SHORT_BREAK_TIME;
    return LONG_BREAK_TIME;
  };

  let progress = 0;
  if (!state.isStopwatchMode) {
    progress = ((getTotalTime() - state.timeLeft) / getTotalTime()) * 100;
  } else {
    // For stopwatch, animate the ring every 60 seconds
    progress = ((state.stopwatchTime % 60) / 60) * 100;
  }

  // Circular progress SVG variables
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const timeStr = formatTime(state.isStopwatchMode ? state.stopwatchTime : state.timeLeft);
  const timeSizeClass = timeStr.length > 5 ? 'text-4xl' : 'text-5xl';

  return (
    <div className="glass-card p-6 min-h-[400px] relative overflow-hidden group border border-fuchsia-500/20 flex flex-col items-center justify-center">
      <div className="absolute top-0 left-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl -z-10 group-hover:bg-fuchsia-500/20 transition-colors duration-500"></div>

      <div className="absolute top-6 left-6 flex items-center z-10">
        <button 
          onClick={toggleStopwatchMode}
          className="px-3 py-1.5 rounded-full bg-[var(--background)] border border-[var(--card-border)] text-xs font-semibold text-[var(--foreground)] shadow-sm hover:border-fuchsia-500/50 hover:text-fuchsia-500 transition-colors flex items-center gap-1.5"
        >
          {state.isStopwatchMode ? <Clock size={14} /> : <Timer size={14} />}
          {state.isStopwatchMode ? "Stopwatch" : "Pomodoro"}
        </button>
      </div>

      {!state.isStopwatchMode && (
        <div className="absolute top-6 right-6 flex items-center space-x-2 z-10">
          <div className="px-3 py-1.5 rounded-full bg-[var(--background)] border border-[var(--card-border)] text-xs font-semibold text-[var(--foreground)] shadow-sm">
            Session {state.sessionCount}
          </div>
        </div>
      )}

      <div className="text-center mb-8 mt-2">
        <h3 className="text-lg font-bold gradient-text flex items-center justify-center gap-2">
          {state.isStopwatchMode ? (
            <><Timer className="text-fuchsia-500" size={20} /> Task Stopwatch</>
          ) : (
            <>
              {state.mode === 'focus' ? <Brain className="text-fuchsia-500" size={20} /> : <Coffee className="text-fuchsia-500" size={20} />}
              {state.mode === 'focus' ? 'Focus Session' : state.mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </>
          )}
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
            stroke="url(#pomodoro-gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "linear" }}
          />
          <defs>
            <linearGradient id="pomodoro-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`${timeSizeClass} font-bold text-[var(--foreground)] tabular-nums tracking-tight transition-all`}>
            {timeStr}
          </span>
          <span className="text-sm text-gray-500 mt-2 uppercase tracking-widest font-semibold">
            {state.isActive ? 'Running' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={toggleTimer}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          {state.isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
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
