'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

const navLinks = [
  { href: '/podcast', label: 'Podcast' },
  { href: '/tutoriales', label: 'Tutoriales' },
  { href: '/academia', label: 'Academia' },
  { href: '/empresarial', label: 'Empresarial' },
  { href: '/eventos', label: 'Eventos' },
];

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`font-medium transition-colors whitespace-nowrap ${
        isActive ? 'text-primary' : 'text-zinc-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={isActive(link.href)}
            />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button className="bg-primary hover:bg-primary/90 text-white font-medium rounded-xl" asChild>
            <a href="https://youtube.com/@DevLokos" target="_blank" rel="noopener noreferrer">
              Suscribirse
            </a>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((o) => !o)}
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  isActive(link.href) ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://youtube.com/@DevLokos"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-lg font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Suscribirse
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
