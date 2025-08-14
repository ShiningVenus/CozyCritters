import React, { useEffect, useState } from "react";
import type { RouteComponentProps } from "wouter";
import { ColorPicker, FontSelector, ResetButton } from "@/components/theme";

interface ThemeSettings {
  primary: string;
  secondary: string;
  accent: string;
  font: string;
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
    Record<"primary" | "secondary" | "accent" | "font" | "reset", string>
  >;
  helpText?: Partial<
    Record<"primary" | "secondary" | "accent" | "font" | "reset", string>
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
  };

  const updateSetting = (key: keyof ThemeSettings, value: string) => {
    if (key !== "font" && !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
      return;
    }
    const newSettings = { ...(settings as ThemeSettings), [key]: value };
    setSettings(newSettings);
    applySettings({ [key]: value } as Partial<ThemeSettings>);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  const reset = () => {
    const root = document.documentElement.style;
    ["--primary", "--secondary", "--accent", "--font-inter"].forEach((v) =>
      root.removeProperty(v)
    );
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

  const label = {
    primary: "Primary Color",
    secondary: "Secondary Color",
    accent: "Accent Color",
    font: "Font",
    reset: "Reset to default",
    ...labels,
  };

  const help = {
    primary: "Select the main color used throughout the app.",
    secondary: "Pick a secondary color for subtle elements.",
    accent: "Choose an accent color for highlights.",
    font: "Choose a font. Options are previewed instantly.",
    reset: "Revert all changes back to the original theme.",
    ...helpText,
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Theme Customizer</h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
        <FontSelector
          label={label.font}
          value={settings.font}
          options={fontOptions}
          onChange={(v) => updateSetting("font", v)}
          helpText={help.font}
        />
        <ResetButton
          label={label.reset}
          onReset={reset}
          helpText={help.reset}
        />
      </form>
    </div>
  );
}

