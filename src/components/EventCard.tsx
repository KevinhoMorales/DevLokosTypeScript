'use client';

import Image from 'next/image';
import { Calendar, MapPin, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface EventCardData {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  eventDate: string;
  location?: string;
  city?: string;
  registrationUrl?: string;
}

function formatEventDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

interface EventCardProps {
  event: EventCardData;
  onShare?: (event: EventCardData) => void;
}

export function EventCard({ event, onShare }: EventCardProps) {
  const locationText = [event.city, event.location].filter(Boolean).join(' · ') || '';

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="flex flex-col rounded-2xl overflow-hidden bg-[#0D0D0D] border border-white/10 hover:border-primary/50 transition-colors"
    >
      <div className="relative w-full aspect-video bg-zinc-900">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
            <Calendar className="w-16 h-16" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
          <Calendar className="w-4 h-4 shrink-0" />
          {formatEventDate(event.eventDate)}
        </div>
        {locationText && (
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
            <MapPin className="w-4 h-4 shrink-0" />
            {locationText}
          </div>
        )}
        {event.description && (
          <p className="text-zinc-400 text-sm line-clamp-3 mb-4 flex-1">{event.description}</p>
        )}
        <div className="flex gap-2 mt-auto">
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center py-2.5 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl text-sm transition-colors"
            >
              Registrarme
            </a>
          )}
          {onShare && (
            <button
              type="button"
              onClick={() => onShare(event)}
              className="inline-flex items-center gap-2 py-2.5 px-4 border border-white/10 hover:border-primary/50 text-zinc-400 hover:text-white rounded-xl text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
