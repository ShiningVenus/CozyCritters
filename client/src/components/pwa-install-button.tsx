import { Download } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

export function PWAInstallButton() {
  const { isInstallable, installApp } = usePWA();

  if (!isInstallable) return null;

  const handleInstall = async () => {
    await installApp();
  };

  return (
    <button
      onClick={handleInstall}
      aria-label="Install app"
      className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
    >
      <Download size={18} className="text-white" />
    </button>
  );
}

