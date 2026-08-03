'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { BookOpen, Check, ChevronDown, GraduationCap, SearchX, User, X } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';
import { learningPathLabel } from '@/lib/i18n-labels';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { CourseCard, type CourseCardData } from '@/components/CourseCard';
import { SECTION_CONTAINER } from '@/lib/section-layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = '593939598029';
const ACADEMY_WHATSAPP_MSG =
  'Hola, me gustaría inscribirme en la Academia DevLokos. ¿Cuáles son los pasos?';

function formatDuration(minutes: number | undefined): string {
  if (!minutes || minutes <= 0) return '';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h 0m`;
}

function difficultyLabel(d: string | undefined): string {
  const v = (d || '').toLowerCase();
  if (v === 'beginner' || v === 'principiante') return 'Principiante';
  if (v === 'intermediate' || v === 'intermedio') return 'Intermedio';
  if (v === 'advanced' || v === 'avanzado') return 'Avanzado';
  return d || '—';
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
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar cursos..." className="mb-6 max-w-2xl" />

        {loading && <LoadingSkeleton count={8} variant="card" className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" />}

        {error && !loading && (
          <ErrorState
            title="Error al cargar cursos"
            message={error}
            onRetry={() => {
              setLoading(true);
              setError(null);
              fetch('/api/courses')
                .then((r) => r.json())
                .then((d) => (d.error ? Promise.reject(new Error(d.error)) : setCourses(d.courses ?? [])))
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
          />
        )}

        {!loading && !error && courses.length === 0 && (
          <EmptyState
            icon={<BookOpen className="w-12 h-12 text-primary" />}
            title="Próximamente"
            subtitle="Estamos preparando los cursos de la Academia. Mientras tanto, escríbenos por WhatsApp."
            action={
              <Button className="bg-primary hover:bg-primary/90 text-white" asChild>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ACADEMY_WHATSAPP_MSG)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar por WhatsApp
                </a>
              </Button>
            }
          />
        )}

        {!loading && !error && courses.length > 0 && (
          <>
            <div className="flex w-full flex-wrap items-center justify-start gap-2 mb-6">
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
                  className={`appearance-none h-10 border rounded-xl pl-4 pr-10 text-sm font-semibold transition-all focus:ring-2 focus:ring-primary/50 focus:outline-none cursor-pointer ${
                    filterPath
                      ? 'bg-primary/15 text-primary border-primary/70'
                      : 'bg-card-bg text-white border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <option value="">Ruta</option>
                  {learningPaths.map((p) => (
                    <option key={p} value={p}>
                      {learningPathLabel(p)}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 w-4 h-4 pointer-events-none ${filterPath ? 'text-primary' : 'text-zinc-400'}`} aria-hidden />
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
                  className={`appearance-none h-10 border rounded-xl pl-4 pr-10 text-sm font-semibold transition-all focus:ring-2 focus:ring-primary/50 focus:outline-none cursor-pointer ${
                    filterDifficulty
                      ? 'bg-primary/15 text-primary border-primary/70'
                      : 'bg-card-bg text-white border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <option value="">Dificultad</option>
                  {difficulties.map((d) => (
                    <option key={d} value={d}>
                      {difficultyLabel(d)}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 w-4 h-4 pointer-events-none ${filterDifficulty ? 'text-primary' : 'text-zinc-400'}`} aria-hidden />
              </div>
              {(filterPath || filterDifficulty || search.trim()) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterPath('');
                    setFilterDifficulty('');
                    setSearch('');
                  }}
                  className="h-10 rounded-xl px-4 text-sm font-semibold bg-card-bg text-primary border border-primary/35 hover:border-primary/60 hover:bg-primary/10 transition-all"
                >
                  Limpiar
                </Button>
              )}
            </div>
            <div className="mb-6">
              <SectionHeader
                title="Cursos"
                align="start"
                trailing={
                  <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
                    {filtered.length}
                  </span>
                }
              />
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={<SearchX className="h-14 w-14" />}
                title="No se encontraron cursos"
                subtitle="Prueba otros filtros o limpia la búsqueda."
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterPath('');
                      setFilterDifficulty('');
                      setSearch('');
                    }}
                    className="rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                  >
                    Limpiar filtros
                  </Button>
                }
              />
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
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card-bg rounded-2xl border border-primary/25 shadow-[0_12px_40px_rgba(255,145,77,0.08)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                aria-hidden
                className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent"
              />
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-primary/20 text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full h-48 sm:h-56 bg-zinc-900 overflow-hidden">
                {selectedCourse.thumbnailUrl ? (
                  <Image
                    src={selectedCourse.thumbnailUrl}
                    alt={selectedCourse.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) 100vw, 672px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-primary/70">
                    <BookOpen className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent opacity-90" />
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-white pr-10 leading-tight">
                  {selectedCourse.title}
                </h2>

                <div className="rounded-2xl border border-primary/22 bg-black/40 p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {selectedCourse.difficulty && (
                      <span className="inline-flex items-center gap-1.5 text-white text-sm font-semibold">
                        <GraduationCap className="w-4 h-4" />
                        {difficultyLabel(selectedCourse.difficulty)}
                      </span>
                    )}
                    {selectedCourse.duration && selectedCourse.duration > 0 && (
                      <span className="text-zinc-400 text-sm font-medium ml-auto">
                        {formatDuration(selectedCourse.duration)}
                      </span>
                    )}
                  </div>
                  {selectedCourse.professor && (
                    <p className="inline-flex items-center gap-1.5 text-white text-sm font-medium">
                      <User className="w-4 h-4" />
                      {selectedCourse.professor}
                    </p>
                  )}
                  {selectedCourse.learningPaths && selectedCourse.learningPaths.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.learningPaths.map((path) => (
                        <span
                          key={path}
                          className="px-2.5 py-1 bg-primary/12 text-primary rounded-full text-xs font-semibold border border-primary/35"
                        >
                          {learningPathLabel(path)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {selectedCourse.description && (
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="w-0.5 h-4 rounded-full bg-primary" />
                      <h3 className="text-primary font-semibold text-sm">Descripción</h3>
                    </div>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                      {selectedCourse.description}
                    </p>
                  </div>
                )}

                {(selectedCourse.learningObjectives ?? []).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="w-0.5 h-4 rounded-full bg-primary" />
                      <h3 className="text-primary font-semibold text-sm">Qué aprenderás</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {(selectedCourse.learningObjectives ?? []).map((obj, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-zinc-300 text-sm">
                          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary/15">
                            <Check className="w-3 h-3 text-primary" />
                          </span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(selectedCourse.modules?.length ?? 0) > 0 && (
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="w-0.5 h-4 rounded-full bg-primary" />
                      <h3 className="text-primary font-semibold text-sm">Contenido del curso</h3>
                    </div>
                    <ol className="space-y-2">
                      {selectedCourse.modules!.map((mod, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 rounded-xl border border-primary/14 bg-black/35 px-3 py-3 text-sm text-white"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/14 text-xs font-bold text-primary">
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
                  className="inline-flex items-center justify-center w-full py-3.5 px-5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors shadow-[0_8px_24px_rgba(255,145,77,0.25)]"
                >
                  Inscribirme por WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
    </section>
  );
}
