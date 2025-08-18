import React, { useState } from "react";
import { MoodCheckIn } from "@/components/mood-check-in";
import { MoodGarden } from "@/components/mood-garden";
import { MiniGamesPreview } from "@/components/mini-games-preview";
import { ThemeToggle } from "@/components/theme-toggle";
import { PWAInstallButton } from "@/components/pwa-install-button";
import { CustomMessages } from "@/components/custom-messages";
import { PrivacySettings } from "@/components/privacy-settings";
import { MoodManager } from "@/components/mood-manager";
import { NavButton } from "@/components/nav-button";

type View = "checkIn" | "moodLog" | "customMessages" | "moodManager" | "privacy";

const views: { id: View; label: string }[] = [
  { id: "checkIn", label: "Check-in" },
  { id: "moodLog", label: "My Garden" },
  { id: "customMessages", label: "Messages" },
  { id: "moodManager", label: "Moods" },
  { id: "privacy", label: "Privacy" },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("checkIn");

  const handleMoodSelected = (mood: { emoji: string; mood: string; message: string; note?: string }) => {
    // The mood will be saved by the EncouragementMessage component
    // We can add any additional logic here if needed
  };

  const handleStartCheckIn = () => {
    setCurrentView("checkIn");
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background shadow-lg relative">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Header */}
      <header role="banner" className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <PWAInstallButton />
          <ThemeToggle />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            <span role="img" aria-label="leaf">🌿</span> Cozy Critter
          </h1>
          <p className="text-sm opacity-90">Your safe space for mood tracking</p>
          <p className="text-xs opacity-70 mt-1">v1.0.0</p>
        </div>
        
        {/* Navigation tabs */}
        <nav role="navigation" aria-label="Main navigation" className="flex justify-center mt-4 space-x-2">
          {views.map((view) => (
            <NavButton
              key={view.id}
              id={view.id}
              label={view.label}
              currentView={currentView}
              onSelect={setCurrentView}
            />
          ))}
        </nav>
      </header>

      {/* Content */}
      <main id="main-content" role="main">
        {currentView === "checkIn" ? (
          <>
            <MoodCheckIn
              onMoodSelected={handleMoodSelected}
              onManageMoods={() => setCurrentView("moodManager")}
            />
            <div className="px-6 pb-6">
              <MiniGamesPreview />
            </div>
          </>
        ) : currentView === "moodLog" ? (
          <MoodGarden onStartCheckIn={handleStartCheckIn} />
        ) : currentView === "customMessages" ? (
          <CustomMessages onBack={() => setCurrentView("checkIn")} />
        ) : currentView === "moodManager" ? (
          <MoodManager onBack={() => setCurrentView("checkIn")} />
        ) : (
          <PrivacySettings onBack={() => setCurrentView("checkIn")} />
        )}
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="p-6 text-center text-sm text-muted-foreground dark:text-muted-foreground">
        <p className="mb-2">
          <span role="img" aria-label="green heart">💚</span> All your data stays private on your device
        </p>
        <p>Made with love for your wellbeing and neurodivergent minds</p>
        <p className="mt-2">
          Need help?{' '}
          <a href="/support" className="underline">
            Visit Support
          </a>
        </p>
      </footer>
    </div>
  );
}
