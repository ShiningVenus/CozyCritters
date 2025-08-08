import { Moon, Sun, Heart } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getNextTheme = () => {
    if (theme === "light") return "dark";
    if (theme === "dark") return "autism awareness";
    return "light";
  };

  const getThemeIcon = () => {
    if (theme === "light") return <Moon size={18} className="text-white" aria-hidden="true" />;
    if (theme === "dark") return <Heart size={18} className="text-white" aria-hidden="true" />;
    return <Sun size={18} className="text-white" aria-hidden="true" />;
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${getNextTheme()} theme`}
      className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
    >
      {getThemeIcon()}
      <span className="sr-only">Switch to {getNextTheme()} theme</span>
    </button>
  );
}