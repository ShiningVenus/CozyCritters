// client/src/App.tsx
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { OfflineIndicator } from "@/components/offline-indicator";
import { ErrorBoundary } from "@/components/error-boundary";
import AppRoutes from "@/router";                // <-- rename import
import { useServiceWorker } from "@/hooks/use-service-worker";
import "@/lib/games";

function App() {
  useServiceWorker();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <OfflineIndicator />
            <Toaster />
            <AppRoutes />                        {/* <-- use renamed component */}
            <PWAInstallPrompt />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

