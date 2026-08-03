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
      className={`bg-card-bg border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer min-w-[180px] ${className}`}
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
