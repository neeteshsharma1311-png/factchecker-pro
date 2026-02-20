import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ThemeName = "cyber" | "matrix" | "crimson" | "phantom" | "stealth";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "cyber", setTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const themes: { id: ThemeName; label: string; color: string }[] = [
  { id: "cyber", label: "Cyber Blue", color: "hsl(199 89% 48%)" },
  { id: "matrix", label: "Matrix Green", color: "hsl(120 100% 40%)" },
  { id: "crimson", label: "Crimson Red", color: "hsl(0 85% 55%)" },
  { id: "phantom", label: "Phantom Purple", color: "hsl(270 80% 60%)" },
  { id: "stealth", label: "Stealth", color: "hsl(210 15% 60%)" },
];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem("fakefact-theme") as ThemeName) || "cyber";
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem("fakefact-theme", t);
  };

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
