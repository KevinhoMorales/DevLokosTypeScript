'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full flex justify-center py-2 sm:py-3 md:py-3 lg:py-3 fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col w-full">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative h-8 w-auto bg-black rounded px-2 py-1">
              <Image
                src="/logo-transparent.png"
                alt="DevLokos Logo"
                width={120}
                height={32}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-end">
            <a 
              href="https://youtube.com/@DevLokos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300"
            >
              <span className="truncate">Suscribirse</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            <span className="material-symbols-outlined text-white">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-b border-white/10 px-6 py-4 bg-black/95 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <a 
                href="https://youtube.com/@DevLokos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all duration-300"
              >
                Suscribirse
              </a>
            </div>
          </div>
        )}
        </div>
      </div>
    </nav>
  );
}
