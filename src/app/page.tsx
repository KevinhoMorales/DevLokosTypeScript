import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import PodcastSection from '@/components/PodcastSection';
import Footer from '@/components/Footer';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DevLokos",
  "description": "Comunidad de desarrolladores y creadores tech en Latinoamérica",
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
      <div className="relative flex min-h-screen w-full max-w-full flex-col overflow-x-hidden items-center">
        <div className="w-full max-w-full flex h-full flex-col items-center">
          <NavBar />
          <main className="w-full max-w-full flex flex-col items-center">
            <HeroSection />
            <PodcastSection />
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
}
