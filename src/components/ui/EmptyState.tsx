'use client';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, subtitle, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {icon && <div className="mb-4 text-zinc-500">{icon}</div>}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {subtitle && <p className="text-zinc-400 text-sm max-w-sm mb-6">{subtitle}</p>}
      {action}
    </div>
  );
}
