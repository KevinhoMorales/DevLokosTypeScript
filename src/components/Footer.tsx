'use client';

import type React from "react"
import { useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Music2, Twitter, Youtube } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsModal from './TermsModal';

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="text-zinc-400 hover:text-white hover:scale-110 transition-all duration-200">
      {icon}
    </Link>
  )
}

export default function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  
  return (
    <footer className="w-full bg-black border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <Logo />
            <p className="text-zinc-500 text-sm">© 2025 DevLokos</p>
            <div className="flex gap-4 text-xs text-zinc-500">
              <button 
                onClick={() => setIsTermsModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Términos de Servicio
              </button>
              <span>|</span>
              <button 
                onClick={() => setIsPrivacyModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Política de Privacidad
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h3 className="text-white font-bold">Contáctanos</h3>
            <p className="text-zinc-400 text-sm">¿Preguntas o comentarios? Nos encantaría escucharte.</p>

            <div className="flex flex-wrap gap-4">
              <SocialLink href="https://instagram.com/devlokos" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="https://facebook.com/devlokos" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="https://youtube.com/@devlokos" icon={<Youtube className="w-5 h-5" />} />
              <SocialLink href="https://x.com/devlokos" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="https://linkedin.com/company/devlokos" icon={<Linkedin className="w-5 h-5" />} />
              <SocialLink href="https://tiktok.com/@devlokos" icon={<Music2 className="w-5 h-5" />} />
              <SocialLink href="https://twitch.tv/devlokos" icon={<Music2 className="w-5 h-5" />} />
              <SocialLink href="https://discord.gg/devlokos" icon={<Music2 className="w-5 h-5" />} />
              <SocialLink href="https://open.spotify.com/show/3u6neVhqqDc693wTS16v1r?si=7FteYjGURHSzSxLtIHM6qg" icon={<Music2 className="w-5 h-5" />} />
            </div>

            <div className="flex items-center gap-2 text-zinc-400 text-sm hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@devlokos.com">info@devlokos.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
      <TermsModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
    </footer>
  );
}
