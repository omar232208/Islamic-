import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/constants/i18n';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface AppState {
  language: Language;
  theme: ThemeMode;
  lastReadSurah: number;
  lastReadVerse: number;
  readingProgress: Record<string, number>;
  prayerMethod: number;
  tasbeehCurrent: number;
  tasbeehTotal: number;
  favoriteSurahs: number[];
  favoriteHadiths: number[];
  dailyPrayerLog: Record<string, string[]>;
}

interface AppContextType extends AppState {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  setLastRead: (surah: number, verse: number) => void;
  updateReadingProgress: (surahId: number, verse: number) => void;
  setPrayerMethod: (method: number) => void;
  incrementTasbeeh: () => void;
  resetTasbeeh: () => void;
  setTasbeehPreset: (target: number) => void;
  toggleFavoriteSurah: (id: number) => void;
  toggleFavoriteHadith: (id: number) => void;
  logPrayer: (prayerName: string) => void;
}

const defaultState: AppState = {
  language: 'en',
  theme: 'auto',
  lastReadSurah: 0,
  lastReadVerse: 0,
  readingProgress: {},
  prayerMethod: 4,
  tasbeehCurrent: 0,
  tasbeehTotal: 0,
  favoriteSurahs: [],
  favoriteHadiths: [],
  dailyPrayerLog: {},
};

const AppContext = createContext<AppContextType>({
  ...defaultState,
  setLanguage: () => {},
  setTheme: () => {},
  setLastRead: () => {},
  updateReadingProgress: () => {},
  setPrayerMethod: () => {},
  incrementTasbeeh: () => {},
  resetTasbeeh: () => {},
  setTasbeehPreset: () => {},
  toggleFavoriteSurah: () => {},
  toggleFavoriteHadith: () => {},
  logPrayer: () => {},
});

const STORAGE_KEY = '@islamic_app_state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setState((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const setLanguage = (language: Language) => updateState({ language });
  const setTheme = (theme: ThemeMode) => updateState({ theme });
  const setPrayerMethod = (prayerMethod: number) => updateState({ prayerMethod });

  const setLastRead = (surah: number, verse: number) => {
    updateState({ lastReadSurah: surah, lastReadVerse: verse });
  };

  const updateReadingProgress = (surahId: number, verse: number) => {
    setState((prev) => {
      const next = {
        ...prev,
        readingProgress: { ...prev.readingProgress, [surahId]: verse },
        lastReadSurah: surahId,
        lastReadVerse: verse,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const incrementTasbeeh = () => {
    setState((prev) => {
      const next = {
        ...prev,
        tasbeehCurrent: prev.tasbeehCurrent + 1,
        tasbeehTotal: prev.tasbeehTotal + 1,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetTasbeeh = () => {
    setState((prev) => {
      const next = { ...prev, tasbeehCurrent: 0 };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const setTasbeehPreset = (target: number) => {
    setState((prev) => {
      const next = { ...prev, tasbeehCurrent: 0 };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleFavoriteSurah = (id: number) => {
    setState((prev) => {
      const favs = prev.favoriteSurahs.includes(id)
        ? prev.favoriteSurahs.filter((f) => f !== id)
        : [...prev.favoriteSurahs, id];
      const next = { ...prev, favoriteSurahs: favs };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleFavoriteHadith = (id: number) => {
    setState((prev) => {
      const favs = prev.favoriteHadiths.includes(id)
        ? prev.favoriteHadiths.filter((f) => f !== id)
        : [...prev.favoriteHadiths, id];
      const next = { ...prev, favoriteHadiths: favs };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const logPrayer = (prayerName: string) => {
    const today = new Date().toISOString().split('T')[0];
    setState((prev) => {
      const todayPrayers = prev.dailyPrayerLog[today] || [];
      if (todayPrayers.includes(prayerName)) return prev;
      const next = {
        ...prev,
        dailyPrayerLog: {
          ...prev.dailyPrayerLog,
          [today]: [...todayPrayers, prayerName],
        },
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLanguage,
        setTheme,
        setLastRead,
        updateReadingProgress,
        setPrayerMethod,
        incrementTasbeeh,
        resetTasbeeh,
        setTasbeehPreset,
        toggleFavoriteSurah,
        toggleFavoriteHadith,
        logPrayer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
