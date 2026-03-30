"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

/* ─── Types ──────────────────────────────────────────────────── */

type Theme = "light" | "dark";

interface ThemeAPI {
  theme: Theme;
  toggleTheme: () => void;
}

/* ─── Context ────────────────────────────────────────────────── */

const ThemeContext = createContext<ThemeAPI | null>(null);

export function useTheme(): ThemeAPI {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/* ─── Helper ─────────────────────────────────────────────────── */

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

/* ─── Provider ───────────────────────────────────────────────── */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // On mount: read persisted / system preference and apply
  useEffect(() => {
    const resolved = getInitialTheme();
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
