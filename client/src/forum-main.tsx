// Standalone Forums Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { OfflineIndicator } from "@/components/offline-indicator";
import { ErrorBoundary } from "@/components/error-boundary";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { StandaloneForum } from "@/components/standalone-forum";
import "@/index.css";

function ForumsApp() {
  useServiceWorker();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <OfflineIndicator />
            <Toaster />
            <StandaloneForum />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const container = document.getElementById('forum-root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<ForumsApp />);
} else {
  console.error('Could not find forum-root element');
}