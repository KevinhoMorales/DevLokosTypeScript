'use client';

import { useEffect, useState, useMemo } from 'react';
import { BookOpen, Check } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { EmptyState } from '@/components/ui/EmptyState';
import { CourseCard, type CourseCardData } from '@/components/CourseCard';
import { SECTION_CONTAINER } from '@/lib/section-layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = '593939598029';

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function AcademySection() {
  const [courses, setCourses] = useState<CourseCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterPath, setFilterPath] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<CourseCardData | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCourses(data.courses ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false));
  }, []);

  const learningPaths = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => (c.learningPaths ?? []).forEach((p) => set.add(p)));
    return Array.from(set).sort();
  }, [courses]);

  const difficulties = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.difficulty) set.add(c.difficulty);
    });
    return Array.from(set);
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (search.trim()) {
        const q = normalize(search);
        const matchTitle = normalize(c.title).includes(q);
        const matchDesc = (c.description && normalize(c.description).includes(q)) || false;
        if (!matchTitle && !matchDesc) return false;
      }
      if (filterPath && !(c.learningPaths ?? []).includes(filterPath)) return false;
      if (filterDifficulty && (c.difficulty || '').toLowerCase() !== filterDifficulty.toLowerCase()) return false;
      return true;
    });
  }, [courses, search, filterPath, filterDifficulty]);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCourse(null);
    };
    if (selectedCourse) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onEscape);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEscape);
    };
  }, [selectedCourse]);

  const whatsappMessage = selectedCourse
    ? `Hola, me interesa inscribirme al curso: ${encodeURIComponent(selectedCourse.title)}`
    : '';

  return (
    <section id="academy-section" className={`${SECTION_CONTAINER} bg-black`}>
      <SectionIntro>
        Cursos estructurados por rutas de aprendizaje. Formación guiada para desarrolladores que buscan crecer paso a paso.
      </SectionIntro>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar cursos..." className="mb-6" />

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <EmptyState
            title="Error al cargar cursos"
            subtitle={error}
            action={
              <Button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetch('/api/courses')
                    .then((r) => r.json())
                    .then((d) => (d.error ? Promise.reject(new Error(d.error)) : setCourses(d.courses ?? [])))
                    .catch((e) => setError(e.message))
                    .finally(() => setLoading(false));
                }}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Reintentar
              </Button>
            }
          />
        )}

        {!loading && !error && courses.length === 0 && (
          <EmptyState
            icon={<BookOpen className="w-12 h-12 text-primary" />}
            title="Academia próximamente"
            subtitle="Estamos preparando los cursos."
          />
        )}

        {!loading && !error && courses.length > 0 && (
          <>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <select
                value={filterPath}
                onChange={(e) => setFilterPath(e.target.value)}
                className="bg-[#0D0D0D] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary/50"
              >
                <option value="">Ruta de aprendizaje</option>
                {learningPaths.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-[#0D0D0D] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary/50"
              >
                <option value="">Dificultad</option>
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d === 'Beginner' ? 'Principiante' : d === 'Intermediate' ? 'Intermedio' : d === 'Advanced' ? 'Avanzado' : d}
                  </option>
                ))}
              </select>
              {(filterPath || filterDifficulty) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterPath('');
                    setFilterDifficulty('');
                  }}
                  className="border-white/10 text-zinc-400 hover:text-white"
                >
                  Limpiar
                </Button>
              )}
            </div>

            {filtered.length === 0 ? (
              <EmptyState title="No se encontraron cursos" subtitle="Prueba otros filtros o búsqueda." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <CourseCard course={course} onClick={() => setSelectedCourse(course)} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {selectedCourse && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedCourse(null)}
          >
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0D0D0D] rounded-2xl border border-white/10 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Cerrar"
              >
                ×
              </button>
              <h3 className="text-xl font-bold text-white pr-10 mb-4">{selectedCourse.title}</h3>
              {selectedCourse.description && (
                <p className="text-zinc-400 text-sm mb-4">{selectedCourse.description}</p>
              )}
              {(selectedCourse.learningObjectives ?? []).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-white font-semibold text-sm mb-2">Qué aprenderás</h4>
                  <ul className="space-y-1">
                    {selectedCourse.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
              >
                Inscribirme por WhatsApp
              </a>
            </div>
          </div>
        )}
    </section>
  );
}
