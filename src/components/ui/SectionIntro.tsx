'use client';

import { motion } from 'framer-motion';

/**
 * Bloque de descripción estándar para todas las secciones.
 * Referencia visual: Podcast.
 * - Mismo espaciado, tipografía y color en toda la web.
 * - Texto mínimo 2 líneas para coherencia.
 */
export function SectionIntro({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-12">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-intro-text text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
      >
        {children}
      </motion.p>
    </div>
  );
}
