// Background-capable reminder scheduling.
//
// The previous implementation used a JS setInterval to fire notifications,
// which only runs while the app's JS is actually executing - so reminders
// stopped the moment the app was backgrounded or killed. Real background
// delivery on Android/iOS requires the OS itself to own the schedule, which
// means using expo-notifications' *date-triggered* local notifications:
// each one is scheduled up front with its content baked in, and the OS
// shows it at the right time with no app process required.
//
// Both platforms cap the number of pending scheduled notifications (iOS at
// 64), so we schedule a rolling batch and top it up every time the app is
// opened or settings change - `reconcileDelivered` figures out which of the
// previously-scheduled ones have already fired (for backfilling stats) and
// `scheduleUpcoming` replaces the batch with a fresh one.
//
// Because it's local-only, background reminders always use the offline
// quote library. AI-generated text (Gemini or the optional legacy backend)
// requires a live network call, so it's only available while the app is in
// the foreground (manual "Send Reminder Now" and the periodic in-app pick).

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { getRandomQuote, Quote, QuoteCategory } from '@/constants/quotes';

const STORAGE_KEY = 'reminderSchedule:v1';
const MAX_PENDING = 50;
const NOTIFICATION_TITLE = '📱 Screen Time Reminder';

interface ScheduledEntry {
  notifId: string;
  fireAt: number; // epoch ms
}

async function readSchedule(): Promise<ScheduledEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeSchedule(entries: ScheduledEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.log('Error saving reminder schedule', error);
  }
}

async function scheduleAt(fireDate: Date, body: string): Promise<string | null> {
  const content = {
    title: NOTIFICATION_TITLE,
    body,
    sound: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  };

  try {
    return await Notifications.scheduleNotificationAsync({
      content,
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireDate } as any,
    });
  } catch (error) {
    // Fall back for older/newer expo-notifications trigger shapes.
    try {
      return await Notifications.scheduleNotificationAsync({
        content,
        trigger: fireDate as any,
      });
    } catch (fallbackError) {
      console.log('Error scheduling reminder', fallbackError);
      return null;
    }
  }
}

/**
 * Cancels everything previously scheduled by this app and schedules a fresh
 * rolling batch of upcoming reminders, each with real quote text already
 * baked in so the OS can deliver them without the app running.
 */
export async function scheduleUpcoming(options: {
  intervalMinutes: number;
  categories: QuoteCategory[];
  extraQuotes: Quote[];
}): Promise<void> {
  const { intervalMinutes, categories, extraQuotes } = options;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const entries: ScheduledEntry[] = [];
  let lastId: string | undefined;
  const now = Date.now();

  for (let i = 1; i <= MAX_PENDING; i++) {
    const fireAt = now + i * intervalMinutes * 60000;
    const quote = getRandomQuote(categories, lastId, extraQuotes);
    lastId = quote.id;

    const notifId = await scheduleAt(new Date(fireAt), quote.text);
    if (notifId) entries.push({ notifId, fireAt });
  }

  await writeSchedule(entries);
}

export async function cancelUpcoming(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await writeSchedule([]);
}

/**
 * Figures out how many scheduled reminders have already fired (their
 * trigger time is in the past) since we last checked, bucketed by the
 * local date they fired on, so the caller can back-fill the stats/history
 * that a background-delivered notification has no other way to report.
 */
export async function reconcileDelivered(): Promise<Record<string, number>> {
  const entries = await readSchedule();
  const now = Date.now();

  const delivered = entries.filter((e) => e.fireAt <= now);
  const remaining = entries.filter((e) => e.fireAt > now);
  await writeSchedule(remaining);

  const counts: Record<string, number> = {};
  for (const entry of delivered) {
    const date = new Date(entry.fireAt).toISOString().slice(0, 10);
    counts[date] = (counts[date] ?? 0) + 1;
  }
  return counts;
}
