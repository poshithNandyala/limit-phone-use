// Pure streak-calculation helpers, kept separate from the UI so they're easy
// to reason about (and reuse) independent of any component.

export interface StreakInfo {
  current: number;
  longest: number;
}

const dayMs = 24 * 60 * 60 * 1000;

function toDateOnly(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getTime();
}

export function computeStreak(completedDates: string[]): StreakInfo {
  const unique = Array.from(new Set(completedDates)).sort();
  if (unique.length === 0) return { current: 0, longest: 0 };

  const set = new Set(unique);
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = new Date(Date.now() - dayMs).toISOString().slice(0, 10);

  let current = 0;
  let cursor: string | null = null;
  if (set.has(todayStr)) cursor = todayStr;
  else if (set.has(yesterdayStr)) cursor = yesterdayStr;

  if (cursor) {
    let cursorTime = toDateOnly(cursor);
    while (set.has(new Date(cursorTime).toISOString().slice(0, 10))) {
      current += 1;
      cursorTime -= dayMs;
    }
  }

  let longest = 0;
  let run = 0;
  let prevTime: number | null = null;
  for (const dateStr of unique) {
    const time = toDateOnly(dateStr);
    if (prevTime !== null && time - prevTime === dayMs) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prevTime = time;
  }

  return { current, longest: Math.max(longest, current) };
}

export interface Milestone {
  days: number;
  emoji: string;
  label: string;
}

export const MILESTONES: Milestone[] = [
  { days: 365, emoji: '🌟', label: '1 year' },
  { days: 180, emoji: '💠', label: '6 months' },
  { days: 100, emoji: '👑', label: '100 days' },
  { days: 60, emoji: '💎', label: '60 days' },
  { days: 30, emoji: '🏆', label: '30 days' },
  { days: 14, emoji: '💪', label: '2 weeks' },
  { days: 7, emoji: '🔥', label: '1 week' },
  { days: 3, emoji: '✨', label: '3 days' },
  { days: 1, emoji: '🌱', label: 'Day 1' },
];

export function getMilestone(streak: number): Milestone | null {
  return MILESTONES.find((m) => streak >= m.days) ?? null;
}

// Last N days (oldest first) as YYYY-MM-DD strings, for a simple calendar grid.
export function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(new Date(Date.now() - i * dayMs).toISOString().slice(0, 10));
  }
  return days;
}
