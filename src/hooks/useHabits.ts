import { useState, useEffect } from 'react';
import type { Habit, HabitCompletion } from '../types/habit';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('genz_habits');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completions, setCompletions] = useState<HabitCompletion[]>(() => {
    try {
      const saved = localStorage.getItem('genz_habit_completions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('genz_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('genz_habit_completions', JSON.stringify(completions));
  }, [completions]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const removeHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => prev.filter((c) => c.habitId !== id));
  };

  const logCompletion = (habitId: string, dateStr: string, amount: number = 1) => {
    setCompletions((prev) => {
      const existing = prev.find((c) => c.habitId === habitId && c.date === dateStr);
      if (existing) {
        return prev.map((c) => 
          c.habitId === habitId && c.date === dateStr 
            ? { ...c, count: Math.max(0, c.count + amount) }
            : c
        );
      }
      return [...prev, { habitId, date: dateStr, count: Math.max(0, amount) }];
    });
  };

  const getCompletionsForHabit = (habitId: string) => {
    return completions.filter((c) => c.habitId === habitId);
  };

  return {
    habits,
    completions,
    addHabit,
    removeHabit,
    logCompletion,
    getCompletionsForHabit,
  };
}
