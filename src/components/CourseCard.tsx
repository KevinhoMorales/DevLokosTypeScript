'use client';

import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { learningPathLabel } from '@/lib/i18n-labels';

export interface CourseCardData {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  difficulty?: string;
  duration?: number;
  learningPaths?: string[];
  modules?: { title?: string }[];
  learningObjectives?: string[];
  /** Nombre del instructor (viene como `professor` del API). */
  professor?: string;
}

function difficultyClass(d: string | undefined): string {
  const v = (d || '').toLowerCase();
  if (v === 'beginner' || v === 'principiante') {
    return 'bg-green-500/20 text-green-400 border-green-500/45';
  }
  if (v === 'intermediate' || v === 'intermedio') {
    return 'bg-amber-500/20 text-amber-400 border-amber-500/45';
  }
  if (v === 'advanced' || v === 'avanzado') {
    return 'bg-red-500/20 text-red-400 border-red-500/45';
  }
  return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

function difficultyLabel(d: string | undefined): string {
  const v = (d || '').toLowerCase();
  if (v === 'beginner' || v === 'principiante') return 'Principiante';
  if (v === 'intermediate' || v === 'intermedio') return 'Intermedio';
  if (v === 'advanced' || v === 'avanzado') return 'Avanzado';
  return d || 'General';
}

function formatDuration(minutes: number | undefined): string {
  if (!minutes || minutes <= 0) return '';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h 0m`;
}

interface CourseCardProps {
  course: CourseCardData;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const durationText = formatDuration(course.duration);
  const moduleCount = course.modules?.length ?? 0;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group flex flex-col text-left rounded-2xl overflow-hidden bg-card-bg border border-primary/20 hover:border-primary/45 cursor-pointer transition-colors shadow-[0_12px_40px_rgba(255,145,77,0.05)]"
    >
      <div className="relative w-full h-40 bg-zinc-900 shrink-0">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-primary/70">
            <BookOpen className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {moduleCount > 0 && (
          <span className="absolute right-3 bottom-3 text-xs px-2.5 py-1 rounded-lg bg-black/70 text-white border border-primary/35 font-semibold">
            {moduleCount} módulos
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 space-y-2.5">
        <h3 className="text-white text-lg font-bold leading-snug line-clamp-2">
          {course.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {course.difficulty && (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${difficultyClass(course.difficulty)}`}
            >
              {difficultyLabel(course.difficulty)}
            </span>
          )}
          {durationText && (
            <span className="text-zinc-500 text-xs font-medium">{durationText}</span>
          )}
        </div>
        {course.learningPaths && course.learningPaths.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {course.learningPaths.slice(0, 3).map((path) => (
              <span
                key={path}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/12 text-primary border border-primary/35"
              >
                {learningPathLabel(path)}
              </span>
            ))}
          </div>
        )}
        <p className="text-primary text-sm font-semibold pt-1 mt-auto">Ver curso</p>
      </div>
    </motion.button>
  );
}
