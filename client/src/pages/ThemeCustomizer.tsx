import React, { useEffect, useState } from "react";
import type { RouteComponentProps } from "wouter";
import { 
  ColorPicker, 
  FontSelector, 
  FontSizeSelector,
  SpacingSelector,
  ThemePresetSelector,
  ResetButton 
} from "@/components/theme";

interface ThemeSettings {
  primary: string;
  secondary: string;
  accent: string;
  font: string;
  fontSize: string;
  spacing: string;
  preset: string;
}

const STORAGE_KEY = "cozy-critter-theme-settings";

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1)))
      .toString(16)
      .padStart(2, "0");
  return `#${f(0)}${f(8)}${f(4)}`;
}

function cssVarToHex(value: string) {
  const v = value.trim();
  if (!v) return "#000000";
  if (v.startsWith("#")) return v;
  const nums = v.match(/[-\d.]+/g);
  if (!nums) return "#000000";
  if (v.startsWith("hsl")) {
    const [h, s, l] = nums.map(Number);
    return hslToHex(h, s, l);
  }
  if (v.startsWith("rgb")) {
    const [r, g, b] = nums.map(Number);
    return `#${[r, g, b]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")}`;
  }
  return "#000000";
}

interface ThemeCustomizerProps extends RouteComponentProps {
  labels?: Partial<
    Record<"primary" | "secondary" | "accent" | "font" | "fontSize" | "spacing" | "preset" | "reset", string>
  >;
  helpText?: Partial<
    Record<"primary" | "secondary" | "accent" | "font" | "fontSize" | "spacing" | "preset" | "reset", string>
  >;
}

export default function ThemeCustomizer({
  labels = {},
  helpText = {},
}: ThemeCustomizerProps) {
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [defaults, setDefaults] = useState<ThemeSettings | null>(null);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const initial: ThemeSettings = {
      primary: cssVarToHex(style.getPropertyValue("--primary")),
      secondary: cssVarToHex(style.getPropertyValue("--secondary")),
      accent: cssVarToHex(style.getPropertyValue("--accent")),
      font: style.getPropertyValue("--font-inter").trim() || "'Inter', sans-serif",
      fontSize: style.getPropertyValue("--font-size-base").trim() || "16px",
      spacing: style.getPropertyValue("--spacing-md").trim() || "1rem",
      preset: "default",
    };
    setDefaults(initial);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: ThemeSettings = JSON.parse(stored);
        applySettings(parsed);
        setSettings(parsed);
        return;
      } catch (e) {
        console.warn("Failed to parse theme settings", e);
      }
    }
    setSettings(initial);
  }, []);

  const applySettings = (s: Partial<ThemeSettings>) => {
    const root = document.documentElement.style;
    if (s.primary) root.setProperty("--primary", s.primary);
    if (s.secondary) root.setProperty("--secondary", s.secondary);
    if (s.accent) root.setProperty("--accent", s.accent);
    if (s.font) root.setProperty("--font-inter", s.font);
    if (s.fontSize) root.setProperty("--font-size-base", s.fontSize);
    if (s.spacing) root.setProperty("--spacing-md", s.spacing);
    
    // Apply theme preset
    if (s.preset && s.preset !== "default") {
      document.documentElement.className = s.preset;
    } else if (s.preset === "default") {
      document.documentElement.className = "";
    }
  };

  const updateSetting = (key: keyof ThemeSettings, value: string) => {
    if (key !== "font" && key !== "fontSize" && key !== "spacing" && key !== "preset" && !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
      return;
    }
    const newSettings = { ...(settings as ThemeSettings), [key]: value };
    setSettings(newSettings);
    applySettings({ [key]: value } as Partial<ThemeSettings>);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  const reset = () => {
    const root = document.documentElement.style;
    ["--primary", "--secondary", "--accent", "--font-inter", "--font-size-base", "--spacing-md"].forEach((v) =>
      root.removeProperty(v)
    );
    document.documentElement.className = "";
    localStorage.removeItem(STORAGE_KEY);
    if (defaults) {
      setSettings(defaults);
    }
  };

  if (!settings) return null;

  const fontOptions = [
    { label: "Inter", value: "'Inter', sans-serif" },
    { label: "Arial", value: "'Arial', sans-serif" },
    { label: "Georgia", value: "'Georgia', serif" },
    { label: "Comic Sans", value: "'Comic Sans MS', cursive" },
    { label: "Courier New", value: "'Courier New', monospace" },
  ];

  const fontSizeOptions = [
    { label: "Small (14px)", value: "14px" },
    { label: "Medium (16px)", value: "16px" },
    { label: "Large (18px)", value: "18px" },
    { label: "Extra Large (20px)", value: "20px" },
  ];

  const spacingOptions = [
    { label: "Compact", value: "0.5rem" },
    { label: "Normal", value: "1rem" },
    { label: "Comfortable", value: "1.5rem" },
    { label: "Spacious", value: "2rem" },
  ];

  const themePresetOptions = [
    { label: "Default", value: "default", description: "Standard light theme" },
    { label: "Dark Mode", value: "dark", description: "Easy on sensitive eyes" },
    { label: "Autism Awareness", value: "autism-awareness", description: "Warm, calming golden tones" },
    { label: "Sensory-Friendly", value: "sensory-friendly", description: "Low contrast, muted colors" },
  ];

  const label = {
    preset: "Theme Preset",
    primary: "Primary Color",
    secondary: "Secondary Color",
    accent: "Accent Color",
    font: "Font",
    fontSize: "Font Size",
    spacing: "Spacing",
    reset: "Reset to default",
    ...labels,
  };

  const help = {
    preset: "Choose a pre-designed theme optimized for different needs.",
    primary: "Select the main color used throughout the app.",
    secondary: "Pick a secondary color for subtle elements.",
    accent: "Choose an accent color for highlights.",
    font: "Choose a font. Options are previewed instantly.",
    fontSize: "Select a comfortable text size for better readability.",
    spacing: "Choose spacing that feels comfortable for your eyes.",
    reset: "Revert all changes back to the original theme.",
    ...helpText,
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Theme Customizer</h2>
      <p className="text-muted-foreground">
        Customize your experience with colors, fonts, and spacing that work best for you.
      </p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ThemePresetSelector
          label={label.preset}
          value={settings.preset}
          options={themePresetOptions}
          onChange={(v) => updateSetting("preset", v)}
          helpText={help.preset}
        />
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Custom Colors</h3>
          <div className="space-y-4">
            <ColorPicker
              id="primary"
              label={label.primary}
              value={settings.primary}
              onChange={(v) => updateSetting("primary", v)}
              helpText={help.primary}
            />
            <ColorPicker
              id="secondary"
              label={label.secondary}
              value={settings.secondary}
              onChange={(v) => updateSetting("secondary", v)}
              helpText={help.secondary}
            />
            <ColorPicker
              id="accent"
              label={label.accent}
              value={settings.accent}
              onChange={(v) => updateSetting("accent", v)}
              helpText={help.accent}
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Typography & Layout</h3>
          <div className="space-y-4">
            <FontSelector
              label={label.font}
              value={settings.font}
              options={fontOptions}
              onChange={(v) => updateSetting("font", v)}
              helpText={help.font}
            />
            <FontSizeSelector
              label={label.fontSize}
              value={settings.fontSize}
              options={fontSizeOptions}
              onChange={(v) => updateSetting("fontSize", v)}
              helpText={help.fontSize}
            />
            <SpacingSelector
              label={label.spacing}
              value={settings.spacing}
              options={spacingOptions}
              onChange={(v) => updateSetting("spacing", v)}
              helpText={help.spacing}
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <ResetButton
            label={label.reset}
            onReset={reset}
            helpText={help.reset}
          />
        </div>
      </form>
    </div>
  );
}

