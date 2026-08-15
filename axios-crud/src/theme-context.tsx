import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "axios-crud:theme-mode";

type ThemeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
  /** True until the persisted preference has been read, to avoid a light→dark flash. */
  ready: boolean;
};

const ThemeModeContext = createContext<ThemeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored === "light" || stored === "dark") {
          setMode(stored);
        }
      })
      .catch((err) => {
        console.log("[theme] failed to load preference", err);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleMode = () => {
    setMode((current) => {
      const next = current === "light" ? "dark" : "light";
      AsyncStorage.setItem(STORAGE_KEY, next).catch((err) => {
        console.log("[theme] failed to save preference", err);
      });
      return next;
    });
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode, ready }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return ctx;
}
