import React, { useState } from "react";
import { MoodCheckIn } from "@/components/mood-check-in";
import { MoodGarden } from "@/components/mood-garden";
import { MiniGamePlaceholder } from "@/components/mini-game-placeholder";
import { ThemeToggle } from "@/components/theme-toggle";
import { CustomMessages } from "@/components/custom-messages";
import { PrivacySettings } from "@/components/privacy-settings";
import { moodStorage } from "@/lib/mood-storage";

type View = "checkIn" | "moodLog" | "customMessages" | "privacy";

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
    <div className="min-h-screen max-w-md mx-auto bg-background dark:bg-background shadow-lg relative">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Header */}
      <header role="banner" className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            <span role="img" aria-label="leaf">🌿</span> Cozy Critter
          </h1>
          <p className="text-sm opacity-90">Your safe space for mood tracking</p>
        </div>
        
        {/* Navigation tabs */}
        <nav role="navigation" aria-label="Main navigation" className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentView("checkIn")}
            aria-pressed={currentView === "checkIn"}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              currentView === "checkIn"
                ? "bg-white bg-opacity-20"
                : "hover:bg-white hover:bg-opacity-10"
            }`}
          >
            Check-in
          </button>
          <button
            onClick={() => setCurrentView("moodLog")}
            aria-pressed={currentView === "moodLog"}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              currentView === "moodLog"
                ? "bg-white bg-opacity-20"
                : "hover:bg-white hover:bg-opacity-10"
            }`}
          >
            My Garden
          </button>
          <button
            onClick={() => setCurrentView("customMessages")}
            aria-pressed={currentView === "customMessages"}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              currentView === "customMessages"
                ? "bg-white bg-opacity-20"
                : "hover:bg-white hover:bg-opacity-10"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setCurrentView("privacy")}
            aria-pressed={currentView === "privacy"}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              currentView === "privacy"
                ? "bg-white bg-opacity-20"
                : "hover:bg-white hover:bg-opacity-10"
            }`}
          >
            Privacy
          </button>
        </nav>
      </header>

      {/* Content */}
      <main id="main-content" role="main">
        {currentView === "checkIn" ? (
          <>
            <MoodCheckIn onMoodSelected={handleMoodSelected} />
            <div className="px-6 pb-6">
              <MiniGamePlaceholder />
            </div>
          </>
        ) : currentView === "moodLog" ? (
          <MoodGarden onStartCheckIn={handleStartCheckIn} />
        ) : currentView === "customMessages" ? (
          <CustomMessages onBack={() => setCurrentView("checkIn")} />
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
      </footer>
    </div>
  );
}
