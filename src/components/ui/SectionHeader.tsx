'use client';

import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  trailing?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, trailing, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-1 h-5 rounded-full bg-primary shrink-0" aria-hidden />
        <h2 className="text-xl md:text-2xl font-bold text-white truncate">{title}</h2>
      </div>
      {trailing}
    </div>
  );
}
