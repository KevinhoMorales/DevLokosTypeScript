'use client';

import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

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
}

function difficultyClass(d: string | undefined): string {
  const v = (d || '').toLowerCase();
  if (v === 'beginner') return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (v === 'intermediate') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  if (v === 'advanced') return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

function difficultyLabel(d: string | undefined): string {
  const v = (d || '').toLowerCase();
  if (v === 'beginner') return 'Principiante';
  if (v === 'intermediate') return 'Intermedio';
  if (v === 'advanced') return 'Avanzado';
  return d || '—';
}

function formatDuration(minutes: number | undefined): string {
  if (!minutes || minutes <= 0) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

interface CourseCardProps {
  course: CourseCardData;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const durationText = formatDuration(course.duration);
  const moduleCount = course.modules?.length ?? 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group flex flex-col rounded-2xl overflow-hidden bg-[#0D0D0D] border border-white/10 hover:border-primary/50 cursor-pointer transition-colors"
    >
      <div className="relative w-full h-[120px] bg-zinc-900 shrink-0">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
            <BookOpen className="w-12 h-12" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${difficultyClass(course.difficulty)}`}>
            {difficultyLabel(course.difficulty)}
          </span>
          {durationText && <span className="text-zinc-500 text-xs">{durationText}</span>}
          {moduleCount > 0 && <span className="text-zinc-500 text-xs">{moduleCount} módulos</span>}
        </div>
        <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        {course.learningPaths && course.learningPaths.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {course.learningPaths.slice(0, 3).map((path) => (
              <span key={path} className="px-2 py-0.5 bg-white/5 rounded text-xs text-zinc-400">
                {path}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
