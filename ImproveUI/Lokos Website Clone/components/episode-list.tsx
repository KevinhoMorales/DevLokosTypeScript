"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EpisodeCard } from "@/components/episode-card"
import { motion } from "framer-motion"

const EPISODES = [
  {
    id: 1,
    episodeNumber: 84,
    title: "Superar los retos y la frustración hasta alcanzar los logros",
    guest: "Irvin Chavalier",
    duration: "0 min",
    image: "/man.jpg",
    description:
      "¡Nuevo episodio de @DevLokos! 🚀 En el episodio #84 conversamos con Irvin Chavalier (@irvin.chav) desde Bolivia 🇧🇴 sobre cómo superar los retos y la frustración hasta alcanzar los logros. 💪 Una charla llena de motivación y experiencias reales.",
  },
  {
    id: 2,
    episodeNumber: 82,
    title: "El futuro del desarrollo web y las nuevas arquitecturas",
    guest: "Angelo Leva",
    duration: "0 min",
    image: "/developer-working.png",
    description:
      "¡Nuevo episodio de @DevLokos! 🚀 En el episodio #82 conversamos con Angelo Leva (@codinglatam) desde Perú 🇵🇪 sobre el futuro del desarrollo web y las nuevas arquitecturas del frontend. 🌐⚙️ Una charla técnica imperdible.",
  },
  {
    id: 3,
    episodeNumber: 81,
    title: "La importancia de la marca personal en la industria tecnológica",
    guest: "Daniel Erazo",
    duration: "1 h 4 min",
    image: "/diverse-person-portrait.png",
    description:
      "¡Nuevo episodio de @DevLokos! 🚀 En el episodio #81 conversamos con Daniel Erazo (@daniiee_29) desde Ecuador 🇪🇨 sobre la importancia de la marca personal en la industria tecnológica. 💼💡 Una charla esencial para tu carrera.",
  },
  {
    id: 4,
    episodeNumber: 80,
    title: "Movilidad sostenible y el nuevo desafío urbano de ParkGO",
    guest: "Luis Talavera",
    duration: "59 min",
    image: "/man.jpg",
    description:
      "¡Nuevo episodio de @DevLokos! 🚀 En el episodio #80 conversamos con Luis Talavera (@alonsito28), CTO de ParkGO (@parkgo.peru), desde Perú 🇵🇪 sobre movilidad sostenible y el nuevo desafío urbano que están resolviendo.",
  },
  {
    id: 5,
    episodeNumber: 79,
    title: "Una Startup peruana que impulsa la movilidad urbana",
    guest: "Katherinne Oyarce",
    duration: "42 min",
    image: "/diverse-person-portrait.png",
    description:
      "¡Nuevo episodio de @DevLokos! 🚀 En el episodio #79 conversamos con Katherinne Oyarce (@katherinne.oyarce), CEO de ParkGO (@parkgo.peru), desde Perú 🇵🇪 sobre la historia de una startup que está revolucionando la movilidad.",
  },
  {
    id: 6,
    episodeNumber: 78,
    title: "Código al negocio, construyendo software con enfoque DDD",
    guest: "Jean Karlo Obando",
    duration: "1 h 9 min",
    image: "/man.jpg",
    description:
      "¡Nuevo episodio de @DevLokos! 🚀 En el episodio #78 conversamos con Jean Karlo Obando (@jeank_obando) desde Ecuador 🇪🇨 sobre cómo pasar del código al negocio aplicando Domain Driven Design (DDD). 💎 Una masterclass de arquitectura.",
  },
]

export function EpisodeList() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 pb-20 space-y-12">
      <div className="space-y-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white text-center"
        >
          Conoce los últimos episodios
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl mx-auto group"
        >
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Input
            type="text"
            placeholder="Buscar episodios por título o invitado..."
            className="relative w-full bg-[#0A0A0A] border-white/10 text-white placeholder:text-zinc-600 h-14 pl-6 pr-14 rounded-2xl focus-visible:ring-orange-500 focus-visible:border-orange-500/50 transition-all shadow-2xl"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 h-6 w-6" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EPISODES.map((episode, index) => (
          <motion.div
            key={episode.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <EpisodeCard
              title={episode.title}
              guest={episode.guest}
              duration={episode.duration}
              image={episode.image}
              description={episode.description}
              episodeNumber={episode.episodeNumber}
            />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 pt-8">
        <Button
          variant="outline"
          className="bg-[#0A0A0A] border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
        >
          Anterior
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" className="h-10 w-10 p-0 text-white font-bold bg-white/10">
            1
          </Button>
          <Button variant="ghost" className="h-10 w-10 p-0 text-zinc-500 hover:text-white hover:bg-white/5">
            2
          </Button>
          <span className="text-zinc-600 px-2">...</span>
          <Button variant="ghost" className="h-10 w-10 p-0 text-zinc-500 hover:text-white hover:bg-white/5">
            26
          </Button>
        </div>

        <Button variant="outline" className="bg-[#0A0A0A] border-white/10 text-white hover:bg-white/10">
          Siguiente
        </Button>
      </div>
    </section>
  )
}
