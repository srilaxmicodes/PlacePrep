export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  activeDaysInLast14: number;
  totalActiveDays: number;
}

/**
 * Calculates current prep streak, longest prep streak, and active days in the last 14 days.
 * An active day is defined as any date (YYYY-MM-DD) with at least 1 recorded prep activity.
 */
export function calculateStreaks(activityDates: string[]): StreakResult {
  if (!activityDates || activityDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDaysInLast14: 0,
      totalActiveDays: 0,
    };
  }

  // Deduplicate and sort dates ascending
  const uniqueDates = Array.from(new Set(activityDates)).sort();

  // Convert YYYY-MM-DD string to local midnight Timestamp for accurate date diff calculation
  const timestamps = uniqueDates.map((d) => new Date(`${d}T00:00:00`).getTime());

  // 1. Calculate Longest Streak
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < timestamps.length; i++) {
    const diffDays = Math.round((timestamps[i] - timestamps[i - 1]) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else if (diffDays > 1) {
      tempStreak = 1;
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // 2. Calculate Current Streak
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTime = new Date(`${todayStr}T00:00:00`).getTime();
  const yesterdayTime = todayTime - 24 * 60 * 60 * 1000;

  let currentStreak = 0;
  const latestActivityTime = timestamps[timestamps.length - 1];

  // If latest activity was today or yesterday, streak is active
  if (latestActivityTime === todayTime || latestActivityTime === yesterdayTime) {
    currentStreak = 1;
    let expectedPrevTime = latestActivityTime - 24 * 60 * 60 * 1000;

    for (let i = timestamps.length - 2; i >= 0; i--) {
      if (timestamps[i] === expectedPrevTime) {
        currentStreak++;
        expectedPrevTime -= 24 * 60 * 60 * 1000;
      } else {
        break;
      }
    }
  }

  // 3. Calculate Active Days in Last 14 Days
  const fourteenDaysAgoTime = todayTime - 13 * 24 * 60 * 60 * 1000;
  const activeDaysInLast14 = timestamps.filter(
    (t) => t >= fourteenDaysAgoTime && t <= todayTime
  ).length;

  return {
    currentStreak,
    longestStreak,
    activeDaysInLast14,
    totalActiveDays: uniqueDates.length,
  };
}

