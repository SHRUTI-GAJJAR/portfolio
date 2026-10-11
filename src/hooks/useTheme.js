import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";

/**
 * Reads the persisted theme, falling back to the OS preference.
 * Runs during the initial render so the first paint is never wrong.
 */
function readInitialTheme() {
  if (typeof window === "undefined") return true;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored === "dark";

  return window.matchMedia("(prefers-color-scheme: light)").matches === false;
}

/**
 * Dark/light theme state backed by localStorage.
 *
 * The `data-theme` attribute lives on <html> so the CSS custom properties in
 * styles.css drive every colour in the app.
 */
export function useTheme() {
  const [dark, setDark] = useState(readInitialTheme);

  // Reflect the theme onto the document.
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    window.localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setDark(event.newValue !== "light");
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = useCallback(() => setDark((value) => !value), []);

  return { dark, toggleTheme };
}