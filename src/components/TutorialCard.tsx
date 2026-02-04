'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

function formatRelativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days < 1) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 30) return `Hace ${days} días`;
  const months = Math.floor(days / 30);
  if (months === 1) return 'Hace 1 mes';
  if (months < 12) return `Hace ${months} meses`;
  const years = Math.floor(months / 12);
  return years === 1 ? 'Hace 1 año' : `Hace ${years} años`;
}

export interface TutorialCardProps {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  playlistTitle?: string;
  onClick: () => void;
}

export function TutorialCard({ title, thumbnailUrl, publishedAt, onClick }: TutorialCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group flex flex-col rounded-2xl overflow-hidden bg-[#0D0D0D] border border-white/10 hover:border-primary/50 cursor-pointer transition-colors"
    >
      <div className="relative w-full aspect-video bg-zinc-900 overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-colors">
          <div className="rounded-full bg-white/95 p-4 shadow-lg">
            <Play className="w-8 h-8 text-primary fill-primary ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-zinc-500 text-sm">{formatRelativeDate(publishedAt)}</p>
      </div>
    </motion.div>
  );
}
