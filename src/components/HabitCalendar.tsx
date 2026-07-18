import type { HabitCompletion } from '../types/habit';

interface HabitCalendarProps {
  completions: HabitCompletion[];
  color: string;
}

export function HabitCalendar({ completions, color }: HabitCalendarProps) {
  // Generate the last 30 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const completionsMap = completions.reduce((acc, curr) => {
    acc[curr.date] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mt-4 border-t border-[var(--card-border)] pt-4">
      <h4 className="text-sm font-medium mb-3 text-[var(--foreground)]">Last 30 Days</h4>
      <div className="flex flex-wrap gap-1.5">
        {days.map((dayStr) => {
          const count = completionsMap[dayStr] || 0;
          const isActive = count > 0;
          
          return (
            <div
              key={dayStr}
              title={`${dayStr}: ${count} completions`}
              className="w-4 h-4 rounded-sm transition-all duration-300"
              style={{
                backgroundColor: isActive ? color : 'var(--card-border)',
                opacity: isActive ? Math.min(0.4 + (count * 0.2), 1) : 0.3,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
