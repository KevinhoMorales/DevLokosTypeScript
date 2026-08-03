/** Temporadas del podcast — extensible para S4+ sin tocar cada vista. */
export type SeasonNumber = 1 | 2 | 3;

export interface PodcastSeasonOption {
  number: SeasonNumber;
  label: `Temporada ${SeasonNumber}`;
  pattern: `S${SeasonNumber}`;
}

export const PODCAST_SEASONS: PodcastSeasonOption[] = [
  { number: 1, label: 'Temporada 1', pattern: 'S1' },
  { number: 2, label: 'Temporada 2', pattern: 'S2' },
  { number: 3, label: 'Temporada 3', pattern: 'S3' },
];

export const DEFAULT_SEASON_LABEL = 'Temporada 2' as const;

/** Detecta temporada por título YouTube (S3 > S2 > S1). Sin marcador → 2. */
export function detectSeasonFromTitle(title: string): SeasonNumber {
  if (title.includes('S3')) return 3;
  if (title.includes('S2')) return 2;
  if (title.includes('S1')) return 1;
  return 2;
}

export function seasonLabel(n: SeasonNumber): string {
  return `Temporada ${n}`;
}

export function emptySeasonMessage(label: string): string {
  if (label === 'Temporada 3') {
    return 'Pronto episodios de Temporada 3. Mientras tanto, explora Temporada 1 o 2.';
  }
  return `No hay episodios en ${label} por ahora.`;
}
