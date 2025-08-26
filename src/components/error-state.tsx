"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while loading this content.",
  onRetry,
  showRetry = false 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-destructive mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({ 
  title = "No data found", 
  message = "There's nothing to display here yet.",
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <div className="h-6 w-6 rounded-full bg-muted-foreground/20" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
      {action}
    </div>
  );
}
