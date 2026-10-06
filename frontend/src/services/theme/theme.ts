import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "theme";

// Saved choice, or the phone's system setting the first time the app runs
export const getTheme = (): ThemeMode => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle("ion-palette-dark", mode === "dark");
  root.style.colorScheme = mode;

  if (Capacitor.isNativePlatform()) {
    // Style.Dark = light status bar icons (for dark backgrounds)
    StatusBar.setStyle({ style: mode === "dark" ? Style.Dark : Style.Light }).catch(
      () => {}
    );
  }
};

export const setTheme = (mode: ThemeMode) => {
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode);
};

export const initTheme = () => applyTheme(getTheme());
