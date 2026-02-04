import ContentSection from '@/components/ContentSection';
import { SECTION_PAGE_WRAPPER } from '@/lib/section-layout';

export const metadata = {
  title: "Tutoriales | DevLokos",
  description: "Vídeos tutoriales organizados por categorías. Búsqueda por título y contenido.",
};

export default function TutorialesPage() {
  return (
    <div className={SECTION_PAGE_WRAPPER}>
      <ContentSection />
    </div>
  );
}
