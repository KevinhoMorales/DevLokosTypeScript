'use client';

import { PODCAST_SEASONS, type PodcastSeasonOption } from '@/lib/podcast-seasons';

interface SeasonFilterProps {
  value: string;
  onChange: (value: string) => void;
  seasons?: PodcastSeasonOption[];
  className?: string;
  'aria-label'?: string;
}

export function SeasonFilter({
  value,
  onChange,
  seasons = PODCAST_SEASONS,
  className = '',
  'aria-label': ariaLabel = 'Filtrar por temporada',
}: SeasonFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-10 bg-[#0D0D0D] border border-primary/40 text-white text-sm rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer min-w-[160px] ${className}`}
      aria-label={ariaLabel}
    >
      {seasons.map((opt) => (
        <option key={opt.label} value={opt.label}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
