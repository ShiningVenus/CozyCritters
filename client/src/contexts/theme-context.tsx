import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "autism-awareness";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem("cozy-critter-theme");
    if (stored === "light" || stored === "dark" || stored === "autism-awareness") {
      return stored as Theme;
    }
    
    // Default to system preference or light mode
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    // Apply theme to document element
    const root = document.documentElement;
    root.classList.remove("dark", "autism-awareness");
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "autism-awareness") {
      root.classList.add("autism-awareness");
    }
    
    // Save to localStorage
    localStorage.setItem("cozy-critter-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "autism-awareness";
      return "light";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}