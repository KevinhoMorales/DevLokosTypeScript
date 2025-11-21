'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
        <Button 
          variant="ghost" 
          className="text-white hover:text-white hover:bg-white/10 font-medium"
          asChild
        >
          <a 
            href="https://youtube.com/@DevLokos"
            target="_blank"
            rel="noopener noreferrer"
          >
            Suscribirse
          </a>
        </Button>
      </div>
    </header>
  );
}
