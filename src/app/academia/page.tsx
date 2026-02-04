import AcademySection from '@/components/AcademySection';
import { SECTION_PAGE_WRAPPER } from '@/lib/section-layout';

export const metadata = {
  title: "Academia | DevLokos",
  description: "Cursos con rutas de aprendizaje y nivel de dificultad. Inscripción directa por mensajería.",
};

export default function AcademiaPage() {
  return (
    <div className={SECTION_PAGE_WRAPPER}>
      <AcademySection />
    </div>
  );
}
