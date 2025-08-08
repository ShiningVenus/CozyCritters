import { useState } from "react";
import { MoodCheckIn } from "@/components/mood-check-in";
import { MoodGarden } from "@/components/mood-garden";
import { MiniGamePlaceholder } from "@/components/mini-game-placeholder";
import { moodStorage } from "@/lib/mood-storage";

type View = "checkIn" | "moodLog";

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
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-lg relative">
      {/* Header */}
      <header className="bg-primary-custom text-white p-6 rounded-b-3xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">🌿 Cozy Critter</h1>
          <p className="text-sm opacity-90">Mood Tracker</p>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => setCurrentView("checkIn")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === "checkIn"
                ? "bg-white bg-opacity-20"
                : "hover:bg-white hover:bg-opacity-10"
            }`}
          >
            Check-in
          </button>
          <button
            onClick={() => setCurrentView("moodLog")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === "moodLog"
                ? "bg-white bg-opacity-20"
                : "hover:bg-white hover:bg-opacity-10"
            }`}
          >
            My Garden
          </button>
        </div>
      </header>

      {/* Content */}
      {currentView === "checkIn" ? (
        <>
          <MoodCheckIn onMoodSelected={handleMoodSelected} />
          <div className="px-6 pb-6">
            <MiniGamePlaceholder />
          </div>
        </>
      ) : (
        <MoodGarden onStartCheckIn={handleStartCheckIn} />
      )}

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500">
        <p className="mb-2">💚 All your data stays private on your device</p>
        <p>Made with love for your wellbeing</p>
      </footer>
    </div>
  );
}
