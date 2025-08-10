import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
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
                onClick={this.handleReset}
                className="gap-2"
                aria-describedby="error-reset-description"
              >
                <RefreshCw size={16} />
                Try Again
              </Button>
              
              <Button 
                onClick={this.handleReload}
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

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer">
                  Technical details (dev mode)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
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