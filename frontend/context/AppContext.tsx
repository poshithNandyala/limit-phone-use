import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote, QuoteCategory } from '@/constants/quotes';
import { getTheme, AppTheme } from '@/constants/theme';

export type ReasonType = 'predefined' | 'ai' | 'both';

export interface DayStat {
  date: string; // YYYY-MM-DD
  minutes: number;
  reminders: number;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string; // ISO timestamp
  completedDates: string[]; // YYYY-MM-DD, sorted ascending
}

interface PersistedState {
  isDark: boolean;
  isEnabled: boolean;
  reminderInterval: number;
  reasonType: ReasonType;
  selectedCategories: QuoteCategory[];
  favorites: string[];
  streak: number;
  lastActiveDate: string | null;
  history: DayStat[];
  customQuotes: Quote[];
  geminiApiKey: string;
  habits: Habit[];
}

const STORAGE_KEY = 'digitalWellbeing:v2';

const todayKey = (date: Date = new Date()) => date.toISOString().slice(0, 10);

const defaultState: PersistedState = {
  isDark: false,
  isEnabled: true,
  reminderInterval: 10,
  reasonType: 'both',
  selectedCategories: [],
  favorites: [],
  streak: 0,
  lastActiveDate: null,
  history: [],
  customQuotes: [],
  geminiApiKey: '',
  habits: [],
};

interface AppContextValue extends PersistedState {
  theme: AppTheme;
  hasLegacyBackend: boolean;
  hasGemini: boolean;
  hasAi: boolean;
  todayMinutes: number;
  todayReminders: number;
  loaded: boolean;
  toggleDark: () => void;
  setIsEnabled: (v: boolean) => void;
  setReminderInterval: (v: number) => void;
  setReasonType: (v: ReasonType) => void;
  toggleCategory: (cat: QuoteCategory) => void;
  clearCategories: () => void;
  toggleFavorite: (quoteId: string) => void;
  isFavorite: (quoteId: string) => boolean;
  addUsageMinute: () => void;
  addReminderSent: () => void;
  addReminderCountsForDates: (counts: Record<string, number>) => void;
  markAppOpened: () => void;
  resetStats: () => void;
  clearFavorites: () => void;
  addCustomQuote: (text: string, category: QuoteCategory) => void;
  deleteCustomQuote: (id: string) => void;
  setGeminiApiKey: (v: string) => void;
  addHabit: (name: string, emoji: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabitToday: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const hasLegacyBackend = !!process.env.EXPO_PUBLIC_BACKEND_URL;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setState({ ...defaultState, ...parsed });
        }
      } catch (e) {
        console.log('Error loading app state', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) =>
      console.log('Error saving app state', e)
    );
  }, [state, loaded]);

  const update = (patch: Partial<PersistedState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const getEntryForDate = (history: DayStat[], date: string): DayStat =>
    history.find((h) => h.date === date) ?? { date, minutes: 0, reminders: 0 };

  const upsertEntryForDate = (history: DayStat[], date: string, patch: Partial<DayStat>) => {
    const existing = history.find((h) => h.date === date);
    const merged: DayStat = {
      date,
      minutes: existing?.minutes ?? 0,
      reminders: existing?.reminders ?? 0,
      ...patch,
    };
    const rest = history.filter((h) => h.date !== date);
    const next = [...rest, merged].sort((a, b) => (a.date < b.date ? 1 : -1));
    return next.slice(0, 60);
  };

  const markAppOpened = () => {
    setState((prev) => {
      const key = todayKey();
      if (prev.lastActiveDate === key) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = prev.lastActiveDate === yesterday.toISOString().slice(0, 10);

      const streak = wasYesterday ? prev.streak + 1 : 1;
      return { ...prev, lastActiveDate: key, streak };
    });
  };

  const addUsageMinute = () => {
    setState((prev) => {
      const today = getEntryForDate(prev.history, todayKey());
      const history = upsertEntryForDate(prev.history, todayKey(), { minutes: today.minutes + 1 });
      return { ...prev, history };
    });
  };

  const addReminderSent = () => {
    setState((prev) => {
      const key = todayKey();
      const today = getEntryForDate(prev.history, key);
      const history = upsertEntryForDate(prev.history, key, { reminders: today.reminders + 1 });
      return { ...prev, history };
    });
  };

  // Used to back-fill stats for reminders that were delivered by the OS
  // while the app wasn't running (background-scheduled notifications).
  const addReminderCountsForDates = (counts: Record<string, number>) => {
    setState((prev) => {
      let history = prev.history;
      for (const [date, count] of Object.entries(counts)) {
        const entry = getEntryForDate(history, date);
        history = upsertEntryForDate(history, date, { reminders: entry.reminders + count });
      }
      return { ...prev, history };
    });
  };

  const toggleFavorite = (quoteId: string) => {
    setState((prev) => {
      const isFav = prev.favorites.includes(quoteId);
      const favorites = isFav
        ? prev.favorites.filter((id) => id !== quoteId)
        : [...prev.favorites, quoteId];
      return { ...prev, favorites };
    });
  };

  const toggleCategory = (cat: QuoteCategory) => {
    setState((prev) => {
      const has = prev.selectedCategories.includes(cat);
      const selectedCategories = has
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat];
      return { ...prev, selectedCategories };
    });
  };

  const addCustomQuote = (text: string, category: QuoteCategory) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const quote: Quote = {
      id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text: trimmed,
      category,
      custom: true,
    };
    setState((prev) => ({ ...prev, customQuotes: [quote, ...prev.customQuotes] }));
  };

  const deleteCustomQuote = (id: string) => {
    setState((prev) => ({
      ...prev,
      customQuotes: prev.customQuotes.filter((q) => q.id !== id),
      favorites: prev.favorites.filter((f) => f !== id),
    }));
  };

  const addHabit = (name: string, emoji: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const habit: Habit = {
      id: `habit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: trimmed,
      emoji: emoji || '🔥',
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    setState((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
  };

  const deleteHabit = (id: string) => {
    setState((prev) => ({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }));
  };

  const toggleHabitToday = (id: string) => {
    const key = todayKey();
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== id) return h;
        const has = h.completedDates.includes(key);
        const completedDates = has
          ? h.completedDates.filter((d) => d !== key)
          : [...h.completedDates, key].sort();
        return { ...h, completedDates };
      }),
    }));
  };

  const todayEntry = useMemo(() => getEntryForDate(state.history, todayKey()), [state.history]);
  const hasGemini = !!state.geminiApiKey.trim();

  const value: AppContextValue = {
    ...state,
    theme: getTheme(state.isDark),
    hasLegacyBackend,
    hasGemini,
    hasAi: hasGemini || hasLegacyBackend,
    todayMinutes: todayEntry.minutes,
    todayReminders: todayEntry.reminders,
    loaded,
    toggleDark: () => update({ isDark: !stateRef.current.isDark }),
    setIsEnabled: (v) => update({ isEnabled: v }),
    setReminderInterval: (v) => update({ reminderInterval: v }),
    setReasonType: (v) => update({ reasonType: v }),
    toggleCategory,
    clearCategories: () => update({ selectedCategories: [] }),
    toggleFavorite,
    isFavorite: (quoteId: string) => stateRef.current.favorites.includes(quoteId),
    addUsageMinute,
    addReminderSent,
    addReminderCountsForDates,
    markAppOpened,
    resetStats: () => update({ history: [], streak: 0, lastActiveDate: null }),
    clearFavorites: () => update({ favorites: [] }),
    addCustomQuote,
    deleteCustomQuote,
    setGeminiApiKey: (v: string) => update({ geminiApiKey: v }),
    addHabit,
    deleteHabit,
    toggleHabitToday,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
