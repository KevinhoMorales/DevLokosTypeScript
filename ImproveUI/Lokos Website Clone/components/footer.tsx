import type React from "react"
import { Facebook, Instagram, Linkedin, Mail, Music2, Twitter, Youtube } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <Logo />
            <p className="text-zinc-500 text-sm">© 2025 DevLokos</p>
            <div className="flex gap-4 text-xs text-zinc-500">
              <Link href="#" className="hover:text-white transition-colors">
                Términos de Servicio
              </Link>
              <span>|</span>
              <Link href="#" className="hover:text-white transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h3 className="text-white font-bold">Contáctanos</h3>
            <p className="text-zinc-400 text-sm">¿Preguntas o comentarios? Nos encantaría escucharte.</p>

            <div className="flex flex-wrap gap-4">
              <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Youtube className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Music2 className="w-5 h-5" />} /> {/* TikTok placeholder */}
              <SocialLink href="#" icon={<Music2 className="w-5 h-5" />} /> {/* Twitch placeholder */}
              <SocialLink href="#" icon={<Music2 className="w-5 h-5" />} /> {/* Discord placeholder */}
              <SocialLink href="#" icon={<Music2 className="w-5 h-5" />} /> {/* Spotify placeholder */}
            </div>

            <div className="flex items-center gap-2 text-zinc-400 text-sm hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@devlokos.com">info@devlokos.com</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="text-zinc-400 hover:text-white hover:scale-110 transition-all duration-200">
      {icon}
    </Link>
  )
}
