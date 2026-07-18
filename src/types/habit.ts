export type HabitCategory = string;
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  target: number;
  color: string;
  createdAt: string;
  icon?: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  count: number;
}
