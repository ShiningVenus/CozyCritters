import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  children 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div 
      className={`flex items-center justify-center gap-2 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <Loader2 
        className={`animate-spin text-muted-foreground ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      {children && (
        <span className="text-sm text-muted-foreground">
          {children}
        </span>
      )}
      <span className="sr-only">Loading, please wait...</span>
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = "Loading your safe space..." }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center">
        <div className="mb-4">
          <span role="img" aria-label="leaf" className="text-4xl">🌿</span>
        </div>
        <LoadingSpinner size="lg" className="mb-4">
          {message}
        </LoadingSpinner>
        <p className="text-xs text-muted-foreground max-w-xs">
          💚 Your data stays private on your device
        </p>
      </div>
    </div>
  );
}