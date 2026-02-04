import HeroSection from '@/components/HeroSection';
import PodcastSection from '@/components/PodcastSection';
import CommunitySection from '@/components/CommunitySection';
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection />
      <PodcastSection />
      <div className={SECTION_PAGE_WRAPPER}>
        <CommunitySection />
      </div>
    </>
  );
}
