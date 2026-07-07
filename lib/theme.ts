"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "coding-tutor:theme";
export type Theme = "dark" | "light";

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const preferred: Theme =
      stored ?? (window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setThemeState(preferred);
    apply(preferred);
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    apply(next);
    window.localStorage.setItem(THEME_KEY, next);
  }

  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
