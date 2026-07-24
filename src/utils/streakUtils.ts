import { getUserStats, updateUserStats } from '../lib/firestore';

export interface StreakData {
  activeDates: string[];
  longestStreak: number;
}

export function calculateCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  
  let currentStreak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date(todayStr);
  
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  if (dates.includes(todayStr) || dates.includes(yesterdayStr)) {
    currentStreak = 1;
    let checkDate = new Date(dates.includes(todayStr) ? todayStr : yesterdayStr);
    while (true) {
      checkDate.setUTCDate(checkDate.getUTCDate() - 1);
      const checkStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(checkStr)) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  return currentStreak;
}

export function calculateMaxStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  let maxTemp = 1;
  let tempStreak = 1;
  for (let i = 1; i < dates.length; i++) {
    const d1 = new Date(dates[i - 1]);
    const d2 = new Date(dates[i]);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
      if (tempStreak > maxTemp) maxTemp = tempStreak;
    } else if (diffDays > 1) {
      tempStreak = 1;
    }
  }
  return maxTemp;
}

export async function getStreakData(userId: string): Promise<StreakData> {
  try {
    const stats = await getUserStats(userId);
    const activeDates = stats.activeDates || [];
    const max = calculateMaxStreak(activeDates);
    return { activeDates, longestStreak: max };
  } catch (e) {
    return { activeDates: [], longestStreak: 0 };
  }
}

export async function markTaskCompletedToday(userId: string): Promise<void> {
  const data = await getStreakData(userId);
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (!data.activeDates.includes(todayStr)) {
    data.activeDates = [...data.activeDates, todayStr].sort();
    await updateUserStats(userId, { activeDates: data.activeDates });
    window.dispatchEvent(new Event('streak_updated'));
  }
}
