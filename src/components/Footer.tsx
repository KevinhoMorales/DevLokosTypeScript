import type React from "react"
import Link from "next/link"
import { Instagram, Linkedin, Mail, Music2, Youtube } from "lucide-react"
import { Logo } from "@/components/Logo"

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-400 hover:text-white hover:scale-110 transition-all duration-200"
    >
      {icon}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 text-center md:text-left">
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Logo />
            <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} DevLokos</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-zinc-500">
              <Link href="/terms" className="hover:text-white transition-colors">
                Términos de Servicio
              </Link>
              <span className="text-zinc-700">|</span>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>

          <div className="space-y-4 flex flex-col items-center md:items-end">
            <h3 className="text-white font-bold">Contáctanos</h3>
            <p className="text-zinc-400 text-sm max-w-xs md:text-right">
              ¿Preguntas o comentarios? Nos encantaría escucharte.
            </p>

            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <SocialLink
                href="https://youtube.com/@devlokos"
                icon={<Youtube className="w-5 h-5" />}
              />
              <SocialLink
                href="https://open.spotify.com/show/3u6neVhqqDc693wTS16v1r?si=7FteYjGURHSzSxLtIHM6qg"
                icon={<Music2 className="w-5 h-5" />}
              />
              <SocialLink
                href="https://instagram.com/devlokos"
                icon={<Instagram className="w-5 h-5" />}
              />
              <SocialLink
                href="https://linkedin.com/company/devlokos"
                icon={<Linkedin className="w-5 h-5" />}
              />
              <SocialLink
                href="https://tiktok.com/@devlokos"
                icon={<Music2 className="w-5 h-5" />}
              />
            </div>

            <div className="flex items-center gap-2 text-zinc-400 text-sm hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@devlokos.com">info@devlokos.com</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex justify-center">
          <Link
            href="/admin/login"
            className="text-[11px] tracking-wide text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Acceso
          </Link>
        </div>
      </div>
    </footer>
  )
}
