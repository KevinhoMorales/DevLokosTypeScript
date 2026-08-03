'use client';

import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  trailing?: ReactNode;
  className?: string;
  /** Default center for public pages */
  align?: 'start' | 'center';
}

export function SectionHeader({
  title,
  trailing,
  className = '',
  align = 'center',
}: SectionHeaderProps) {
  if (align === 'center') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className="flex items-center justify-center gap-3 min-w-0">
          <span className="w-1 h-5 rounded-full bg-primary shrink-0" aria-hidden />
          <h2 className="text-xl md:text-2xl font-bold text-white text-center">
            {title}
          </h2>
        </div>
        {trailing ? (
          <div className="flex justify-center w-full">{trailing}</div>
        ) : null}
      </div>
    );
  }

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
