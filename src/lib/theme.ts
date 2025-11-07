

export type ThemeMode = "light" | "dark";
const KEY = "theme";

export function detectInitialTheme(): ThemeMode {
    const saved = localStorage.getItem(KEY) as ThemeMode | null;
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

export function applyTheme(mode: ThemeMode) {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(KEY, mode);
}
