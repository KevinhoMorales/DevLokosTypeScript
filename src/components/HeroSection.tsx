'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function HeroSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="w-full flex justify-center items-center py-16 sm:py-24 md:py-32 lg:py-40 xl:py-48 2xl:py-56 mt-16 sm:mt-20 md:mt-24 mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28 2xl:mb-36">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex justify-center">
        <div className={`relative flex min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[65vh] xl:min-h-[70vh] flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10 rounded-xl items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 text-center bg-black w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo */}
          <div className={`relative z-10 mb-6 sm:mb-8 md:mb-10 lg:mb-12 pt-12 sm:pt-16 md:pt-18 lg:pt-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <div className="relative h-20 sm:h-24 md:h-28 lg:h-32 w-auto bg-black rounded px-3 sm:px-4 py-1.5 sm:py-2">
              <Image
                src="/logo-transparent.png"
                alt="DevLokos Logo"
                width={200}
                height={80}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className={`relative z-10 flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className={`text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-black leading-tight tracking-[-0.033em] transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Bienvenido a DevLokos
            </h1>
            <div className={`flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-3xl mx-auto text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <h2 className="text-white text-sm sm:text-base md:text-lg lg:text-lg font-normal leading-normal">
                Somos una comunidad que impulsa el aprendizaje en tecnología.
              </h2>
              <h2 className={`text-white text-sm sm:text-base md:text-lg lg:text-lg font-normal leading-normal transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                Nacimos como un podcast y ahora ofrecemos cursos, tutoriales y mucho más.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
