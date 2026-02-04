import PodcastSection from '@/components/PodcastSection';
import { SECTION_PAGE_WRAPPER } from '@/lib/section-layout';

export const metadata = {
  title: "Podcast | DevLokos",
  description: "Episodios del podcast DevLokos. Búsqueda por título o invitado, filtros por temporada y reproductor en pantalla completa.",
};

export default function PodcastPage() {
  return (
    <div className={SECTION_PAGE_WRAPPER}>
      <PodcastSection />
    </div>
  );
}
