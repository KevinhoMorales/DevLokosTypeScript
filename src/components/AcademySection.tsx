'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { BookOpen, Check, ChevronDown, X, Clock, Layers, MessageCircle } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { EmptyState } from '@/components/ui/EmptyState';
import { CourseCard, type CourseCardData } from '@/components/CourseCard';
import { SECTION_CONTAINER } from '@/lib/section-layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = '593939598029';

function formatDuration(minutes: number | undefined): string {
  if (!minutes || minutes <= 0) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function difficultyLabel(d: string | undefined): string {
  const v = (d || '').toLowerCase();
  if (v === 'beginner') return 'Principiante';
  if (v === 'intermediate') return 'Intermedio';
  if (v === 'advanced') return 'Avanzado';
  return d || '—';
}

function difficultyBadgeClass(d: string | undefined): string {
  const v = (d || '').toLowerCase();
  if (v === 'beginner') return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (v === 'intermediate') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  if (v === 'advanced') return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

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

  const academyViewedRef = useRef(false);
  useEffect(() => {
    if (!loading && courses.length >= 0 && !academyViewedRef.current) {
      academyViewedRef.current = true;
      analyticsEvents.academy_home_viewed();
    }
  }, [loading, courses.length]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/5 animate-pulse">
                <div className="w-full h-[120px] bg-[#F97316]/20" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-zinc-800 rounded w-20" />
                  <div className="h-5 bg-zinc-800 rounded w-full" />
                  <div className="h-4 bg-zinc-800 rounded w-5/6" />
                </div>
              </div>
            ))}
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
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <div className="relative inline-flex items-center">
                <select
                  value={filterPath}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFilterPath(v);
                    if (v) {
                      analyticsEvents.learning_path_selected(v, 'academy');
                      analyticsEvents.filter_applied('learning_path', v, 'academy');
                    }
                  }}
                  className={`appearance-none border rounded-full pl-5 pr-10 py-2.5 text-sm font-medium transition-all focus:ring-2 focus:ring-primary/50 focus:outline-none cursor-pointer ${
                    filterPath
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:border-primary/50 hover:text-white'
                  }`}
                >
                  <option value="">Ruta de aprendizaje</option>
                  {learningPaths.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 w-4 h-4 pointer-events-none ${filterPath ? 'text-white' : 'text-zinc-400'}`} aria-hidden />
              </div>
              <div className="relative inline-flex items-center">
                <select
                  value={filterDifficulty}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFilterDifficulty(v);
                    if (v) {
                      analyticsEvents.filter_applied('difficulty', v, 'academy');
                    }
                  }}
                  className={`appearance-none border rounded-full pl-5 pr-10 py-2.5 text-sm font-medium transition-all focus:ring-2 focus:ring-primary/50 focus:outline-none cursor-pointer ${
                    filterDifficulty
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:border-primary/50 hover:text-white'
                  }`}
                >
                  <option value="">Dificultad</option>
                  {difficulties.map((d) => (
                    <option key={d} value={d}>
                      {d === 'Beginner' ? 'Principiante' : d === 'Intermediate' ? 'Intermedio' : d === 'Advanced' ? 'Avanzado' : d}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 w-4 h-4 pointer-events-none ${filterDifficulty ? 'text-white' : 'text-zinc-400'}`} aria-hidden />
              </div>
              {(filterPath || filterDifficulty) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterPath('');
                    setFilterDifficulty('');
                  }}
                  className="rounded-full px-5 py-2.5 text-sm font-medium bg-white/5 text-zinc-400 border border-white/10 hover:border-primary/50 hover:text-white transition-all"
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
                    <CourseCard
                      course={course}
                      onClick={() => {
                        setSelectedCourse(course);
                        analyticsEvents.course_viewed({
                          course_id: course.id,
                          course_title: course.title,
                          level: course.difficulty,
                          learning_paths: course.learningPaths?.join(', '),
                        });
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0D0D0D] rounded-2xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {selectedCourse.thumbnailUrl && (
                <div className="relative w-full h-44 sm:h-52 bg-zinc-900 rounded-t-2xl overflow-hidden">
                  <Image
                    src={selectedCourse.thumbnailUrl}
                    alt={selectedCourse.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) 100vw, 672px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {selectedCourse.difficulty && (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${difficultyBadgeClass(selectedCourse.difficulty)}`}>
                      {difficultyLabel(selectedCourse.difficulty)}
                    </span>
                  )}
                  {selectedCourse.duration && selectedCourse.duration > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-zinc-400 border border-white/10">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(selectedCourse.duration)}
                    </span>
                  )}
                  {(selectedCourse.modules?.length ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-zinc-400 border border-white/10">
                      <Layers className="w-3.5 h-3.5" />
                      {selectedCourse.modules!.length} módulos
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white pr-10 mb-4">{selectedCourse.title}</h2>

                {selectedCourse.learningPaths && selectedCourse.learningPaths.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCourse.learningPaths.map((path) => (
                      <span key={path} className="px-2.5 py-1 bg-primary/15 text-primary rounded-lg text-xs font-medium border border-primary/30">
                        {path}
                      </span>
                    ))}
                  </div>
                )}

                {selectedCourse.description && (
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">{selectedCourse.description}</p>
                )}

                {(selectedCourse.learningObjectives ?? []).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold text-sm mb-3">Qué aprenderás</h3>
                    <ul className="space-y-2">
                      {(selectedCourse.learningObjectives ?? []).map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(selectedCourse.modules?.length ?? 0) > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold text-sm mb-3">Contenido del curso</h3>
                    <ol className="space-y-2">
                      {selectedCourse.modules!.map((mod, i) => (
                        <li key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                          <span className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-zinc-400">
                            {i + 1}
                          </span>
                          {mod.title ?? `Módulo ${i + 1}`}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsEvents.academy_whatsapp_clicked(selectedCourse.title)}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Inscribirme por WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
    </section>
  );
}
