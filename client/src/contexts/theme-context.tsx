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
    
    // Remove all theme classes first
    root.classList.remove("dark", "autism-awareness");
    
    // Add the appropriate theme class
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "autism-awareness") {
      root.classList.add("autism-awareness");
    }
    
    // Debug logging
    console.log('🎨 Theme changed to:', theme);
    console.log('🔧 Classes on root:', root.className);
    console.log('🧪 Root element:', root);
    
    // Save to localStorage
    localStorage.setItem("cozy-critter-theme", theme);
    
    // Force a repaint to ensure styles are applied
    root.style.display = 'none';
    root.offsetHeight; // trigger reflow
    root.style.display = '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      console.log('🔄 Toggling from theme:', prev);
      if (prev === "light") {
        console.log('➡️ Going to dark theme');
        return "dark";
      }
      if (prev === "dark") {
        console.log('➡️ Going to autism-awareness theme');
        return "autism-awareness";
      }
      console.log('➡️ Going to light theme');
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