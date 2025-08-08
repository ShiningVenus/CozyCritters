import { WifiOff, Wifi } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";
import { useState, useEffect } from "react";

export function OfflineIndicator() {
  const { isOnline } = usePWA();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [showBackOnlineMessage, setShowBackOnlineMessage] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
      setShowBackOnlineMessage(false);
    } else if (showOfflineMessage) {
      setShowOfflineMessage(false);
      setShowBackOnlineMessage(true);
      
      // Hide the "back online" message after 3 seconds
      const timer = setTimeout(() => {
        setShowBackOnlineMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  if (!showOfflineMessage && !showBackOnlineMessage) return null;

  return (
    <div className={`fixed top-4 left-4 right-4 max-w-md mx-auto rounded-lg p-3 shadow-lg z-40 transition-all duration-300 ${
      showOfflineMessage 
        ? "bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800" 
        : "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-full ${
          showOfflineMessage 
            ? "bg-orange-200 dark:bg-orange-800" 
            : "bg-green-200 dark:bg-green-800"
        }`}>
          {showOfflineMessage ? (
            <WifiOff size={16} className="text-orange-700 dark:text-orange-300" />
          ) : (
            <Wifi size={16} className="text-green-700 dark:text-green-300" />
          )}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            showOfflineMessage 
              ? "text-orange-800 dark:text-orange-200" 
              : "text-green-800 dark:text-green-200"
          }`}>
            {showOfflineMessage ? "You're offline" : "Back online!"}
          </p>
          <p className={`text-xs ${
            showOfflineMessage 
              ? "text-orange-600 dark:text-orange-300" 
              : "text-green-600 dark:text-green-300"
          }`}>
            {showOfflineMessage 
              ? "Your data is safe and will sync when you reconnect" 
              : "All features are available again"}
          </p>
        </div>
      </div>
    </div>
  );
}