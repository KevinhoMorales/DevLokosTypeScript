import PodcastSection from '@/components/PodcastSection';
import { SECTION_PAGE_WRAPPER } from '@/lib/section-layout';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DevLokos",
  "description": "App móvil que centraliza contenido de tecnología en español: podcast, tutoriales, cursos, servicios empresariales y eventos. Hub digital de la marca DevLokos.",
  "url": "https://devlokos.com",
  "logo": "https://devlokos.com/logo.png",
  "sameAs": [
    "https://youtube.com/@devlokos",
    "https://spotify.com/devlokos",
    "https://instagram.com/devlokos",
    "https://tiktok.com/@devlokos",
    "https://linkedin.com/company/devlokos"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "info@devlokos.com",
    "contactType": "customer service"
  },
  "areaServed": "Latin America",
  "knowsAbout": [
    "Desarrollo web",
    "JavaScript",
    "React",
    "Node.js",
    "TypeScript",
    "Programación",
    "Tecnología"
  ]
};

export const metadata = {
  title: "DevLokos | Podcast",
  description: "Episodios del podcast DevLokos. Búsqueda por título o invitado, filtros por temporada y reproductor en pantalla completa.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className={SECTION_PAGE_WRAPPER}>
        <PodcastSection />
      </div>
    </>
  );
}
