import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(false);

  useEffect(() => {
    // Check if user has permanently dismissed the PWA prompt
    const checkPermanentDismissal = () => {
      const dismissed = localStorage.getItem('cozy-critter-pwa-dismissed');
      if (dismissed === 'true') {
        setIsPermanentlyDismissed(true);
      }
    };

    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Only set as installable if not permanently dismissed
      const dismissed = localStorage.getItem('cozy-critter-pwa-dismissed');
      if (dismissed !== 'true') {
        setInstallPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);
      }
    };

    // Handle successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    checkPermanentDismissal();
    checkIfInstalled();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    if (typeof navigator !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (typeof navigator !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
        return true;
      } else if (choiceResult.outcome === 'dismissed') {
        // User dismissed the prompt, but don't permanently dismiss unless they click "No thanks"
        setIsInstallable(false);
        setInstallPrompt(null);
      }
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  const permanentlyDismiss = () => {
    localStorage.setItem('cozy-critter-pwa-dismissed', 'true');
    setIsPermanentlyDismissed(true);
    setIsInstallable(false);
    setInstallPrompt(null);
  };

  return {
    isInstallable: isInstallable && !isPermanentlyDismissed,
    isInstalled,
    isOnline,
    installApp,
    permanentlyDismiss,
  };
}