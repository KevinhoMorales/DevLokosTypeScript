"use client"

import { Logo } from "@/components/Logo"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-10 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Logo size="lg" />
      </motion.div>

      <div className="space-y-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight"
        >
          DevLokos
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xl md:text-2xl text-white font-medium"
        >
          El hub digital de contenido tech en español
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3 text-zinc-400 text-lg md:text-xl font-light"
        >
          <p>Una app móvil que centraliza en un solo lugar: podcast, tutoriales en video, cursos, servicios empresariales y eventos.</p>
          <p>Para quienes buscan escuchar el podcast, ver tutoriales, estar al día con meetups y workshops, o conectar con DevLokos para proyectos.</p>
        </motion.div>
      </div>
    </section>
  )
}
