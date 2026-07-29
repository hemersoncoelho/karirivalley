"use client";

import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";

export type NbTheme = "light" | "dark";

interface NbThemeContextValue {
  theme: NbTheme;
  toggleTheme: () => void;
  mounted: boolean;
}

const STORAGE_KEY = "kv-nb-theme";

export const NbThemeContext = createContext<NbThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  mounted: false,
});

export function NbThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<NbTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-nb-theme");
    setTheme(attr === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  const applyTheme = useCallback((next: NbTheme) => {
    document.documentElement.setAttribute("data-nb-theme", next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [applyTheme, theme]);

  return (
    <NbThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </NbThemeContext.Provider>
  );
}
