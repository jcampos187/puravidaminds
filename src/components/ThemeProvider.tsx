"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { setThemeCookie } from "@/app/actions";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * The theme to use before client hydration.
   * Read from the "theme" cookie on the server so HTML is correct at first paint.
   */
  initialServerTheme?: Theme;
}

export function ThemeProvider({ children, initialServerTheme = "light" }: ThemeProviderProps) {
  // Lazy state initializer — avoids useEffect cascade warning
  // Server-side: returns initialServerTheme (from cookie, set in layout)
  // Client-side: reads localStorage, then system preference, then falls back to server value
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return initialServerTheme;
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Sync DOM class on mount (SSR can't touch DOM)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system preference changes when no manual preference is stored
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        setThemeState(newTheme);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setThemeState]);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
    // Tell the server so subsequent navigations render the correct class server-side
    setThemeCookie(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
