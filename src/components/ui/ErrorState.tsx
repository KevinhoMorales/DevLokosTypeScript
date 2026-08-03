'use client';

import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  action?: ReactNode;
}

export function ErrorState({
  title = 'Error al cargar',
  message,
  onRetry,
  retryLabel = 'Intentar de nuevo',
  className = '',
  action,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-14 w-14 text-red-400" />}
      title={title}
      subtitle={message}
      className={className}
      action={
        action ??
        (onRetry ? (
          <Button onClick={onRetry} className="bg-primary hover:bg-primary/90 text-white">
            {retryLabel}
          </Button>
        ) : undefined)
      }
    />
  );
}
