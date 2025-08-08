import { Download, X, Smartphone } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";
import { useState } from "react";

export function PWAInstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) return null;

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsDismissed(true);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-primary text-primary-foreground rounded-lg p-4 shadow-lg border border-primary/20 z-50">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary-foreground/20 rounded-lg">
          <Smartphone size={20} className="text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">
            Install Cozy Critter
          </h3>
          <p className="text-xs opacity-90 mb-3">
            Get the app on your home screen for quick access to your mood tracking, even offline!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary-foreground text-primary rounded text-xs font-medium hover:bg-primary-foreground/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            >
              <Download size={14} />
              Install
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="px-3 py-1.5 text-primary-foreground/80 hover:text-primary-foreground text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 rounded"
            >
              Maybe later
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-primary-foreground/60 hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 rounded"
          aria-label="Dismiss install prompt"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}