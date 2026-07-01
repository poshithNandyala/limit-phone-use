import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuoteCategory } from '@/constants/quotes';
import { getTheme, AppTheme } from '@/constants/theme';

export type ReasonType = 'predefined' | 'ai' | 'both';

export interface DayStat {
  date: string; // YYYY-MM-DD
  minutes: number;
  reminders: number;
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
}

const STORAGE_KEY = 'digitalWellbeing:v2';

const todayKey = () => new Date().toISOString().slice(0, 10);

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
};

interface AppContextValue extends PersistedState {
  theme: AppTheme;
  hasAiBackend: boolean;
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
  markAppOpened: () => void;
  resetStats: () => void;
  clearFavorites: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const hasAiBackend = !!process.env.EXPO_PUBLIC_BACKEND_URL;

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

  const getTodayEntry = (history: DayStat[]): DayStat =>
    history.find((h) => h.date === todayKey()) ?? {
      date: todayKey(),
      minutes: 0,
      reminders: 0,
    };

  const upsertTodayEntry = (history: DayStat[], patch: Partial<DayStat>) => {
    const key = todayKey();
    const existing = history.find((h) => h.date === key);
    const merged: DayStat = {
      date: key,
      minutes: existing?.minutes ?? 0,
      reminders: existing?.reminders ?? 0,
      ...patch,
    };
    const rest = history.filter((h) => h.date !== key);
    const next = [...rest, merged].sort((a, b) => (a.date < b.date ? 1 : -1));
    return next.slice(0, 30);
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
      const today = getTodayEntry(prev.history);
      const history = upsertTodayEntry(prev.history, { minutes: today.minutes + 1 });
      return { ...prev, history };
    });
  };

  const addReminderSent = () => {
    setState((prev) => {
      const today = getTodayEntry(prev.history);
      const history = upsertTodayEntry(prev.history, { reminders: today.reminders + 1 });
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

  const todayEntry = useMemo(() => getTodayEntry(state.history), [state.history]);

  const value: AppContextValue = {
    ...state,
    theme: getTheme(state.isDark),
    hasAiBackend,
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
    markAppOpened,
    resetStats: () => update({ history: [], streak: 0, lastActiveDate: null }),
    clearFavorites: () => update({ favorites: [] }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
