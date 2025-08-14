import React, { ReactNode, useCallback, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ErrorBoundary({ children, fallback }: Props) {
  const [error, setError] = useState<Error | null>(null);
  const [key, setKey] = useState(0);

  const handleReset = useCallback(() => {
    setError(null);
    setKey((k) => k + 1);
  }, []);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  if (error) {
    if (fallback) {
      return fallback;
    }

    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 bg-background"
        role="alert"
        aria-label="Application error"
      >
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 text-center shadow-lg">
          <div className="mb-4">
            <AlertTriangle
              className="mx-auto h-12 w-12 text-destructive"
              aria-hidden="true"
            />
          </div>

          <h2 className="text-lg font-semibold text-foreground mb-2">
            Oops! Something went wrong
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            Don't worry - your mood data is still safe on your device.
            This was just a temporary glitch.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleReset}
              className="gap-2"
              aria-describedby="error-reset-description"
            >
              <RefreshCw size={16} />
              Try Again
            </Button>

            <Button
              onClick={handleReload}
              variant="outline"
              className="gap-2"
              aria-describedby="error-reload-description"
            >
              <RefreshCw size={16} />
              Reload App
            </Button>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            <p id="error-reset-description" className="sr-only">
              Try again will attempt to recover from the error without losing your current session
            </p>
            <p id="error-reload-description" className="sr-only">
              Reload app will refresh the entire application
            </p>
            <p>
              💚 Your privacy is protected - no error data is sent anywhere
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Technical details (dev mode)
              </summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <InnerErrorBoundary key={key} onError={setError}>
      {children}
    </InnerErrorBoundary>
  );
}

interface InnerBoundaryProps {
  onError: (error: Error) => void;
  children: ReactNode;
}

class InnerErrorBoundary extends React.Component<InnerBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// Higher-order component for easier use
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}