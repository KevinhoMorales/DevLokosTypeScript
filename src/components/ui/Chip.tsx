'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export function Chip({ active = false, children, className = '', ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border whitespace-nowrap ${
        active
          ? 'bg-primary text-white border-primary'
          : 'bg-transparent text-zinc-400 border-white/10 hover:border-primary/50 hover:text-white'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
