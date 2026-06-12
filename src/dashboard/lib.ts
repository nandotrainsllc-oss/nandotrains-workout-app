// Pure date/score helpers shared across dashboard modules.
import { TARGETS } from './data';
import type { CounterKey, DailyLog } from './types';

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isWeekend(d: Date = new Date()): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

/** Monday of the week containing d, as YYYY-MM-DD. */
export function weekStartKey(d: Date = new Date()): string {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return todayKey(copy);
}

export function weekDates(weekStart: string): string[] {
  const [y, m, d] = weekStart.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(start);
    dt.setDate(start.getDate() + i);
    return todayKey(dt);
  });
}

export function emptyLog(date: string): DailyLog {
  return {
    date,
    posts: 0,
    stories: 0,
    comments: 0,
    coldDMs: 0,
    warmDMs: 0,
    reactivationDMs: 0,
    followUps: 0,
    chatsBooked: 0,
    chatsHeld: 0,
    salesCalls: 0,
    closes: 0,
  };
}

export function counterColor(actual: number, target: number): 'red' | 'yellow' | 'green' {
  const pct = target > 0 ? (actual / target) * 100 : 100;
  if (pct >= 100) return 'green';
  if (pct >= 80) return 'yellow';
  return 'red';
}

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

/** Weekly rollup computed from daily logs. */
export interface WeeklyRollup {
  totals: DailyLog;
  dmToChatPct: number;
  showRatePct: number;
  closeRatePct: number;
  attainment: { key: CounterKey; label: string; actual: number; target: number; pct: number }[];
  worstInput: string;
}

export function computeRollup(
  logs: Record<string, DailyLog>,
  weekStart: string,
  labels: Record<CounterKey, string>,
): WeeklyRollup {
  const dates = weekDates(weekStart);
  const totals = emptyLog(weekStart);
  let weekdaysCount = 0;
  dates.forEach((d, i) => {
    const isWkEnd = i >= 5;
    if (!isWkEnd) weekdaysCount++;
    const log = logs[d];
    if (!log) return;
    (Object.keys(totals) as (keyof DailyLog)[]).forEach((k) => {
      if (k === 'date') return;
      totals[k] += log[k];
    });
  });
  const totalDMs = totals.coldDMs + totals.warmDMs + totals.reactivationDMs;
  const dmToChatPct = totalDMs > 0 ? (totals.chatsBooked / totalDMs) * 100 : 0;
  const showRatePct = totals.chatsBooked > 0 ? (totals.chatsHeld / totals.chatsBooked) * 100 : 0;
  const closeRatePct = totals.salesCalls > 0 ? (totals.closes / totals.salesCalls) * 100 : 0;

  const attainment = (Object.entries(TARGETS) as [CounterKey, number][]).map(([key, daily]) => {
    const target = daily * weekdaysCount;
    const actual = totals[key];
    return { key, label: labels[key], actual, target, pct: target > 0 ? (actual / target) * 100 : 100 };
  });
  const worst = [...attainment].sort((a, b) => a.pct - b.pct)[0];
  return {
    totals,
    dmToChatPct,
    showRatePct,
    closeRatePct,
    attainment,
    worstInput: worst ? `${worst.label} (${Math.round(worst.pct)}% of target)` : '—',
  };
}
