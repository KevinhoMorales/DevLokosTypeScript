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

export function formatEventDate(iso: string): string {
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
  onClick?: (event: EventCardData) => void;
  onRegisterClick?: (event: EventCardData) => void;
}

export function EventCard({ event, onShare, onClick, onRegisterClick }: EventCardProps) {
  const locationText = [event.city, event.location].filter(Boolean).join(' · ') || '';

  return (
    <motion.article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? () => onClick(event) : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(event) : undefined}
      whileHover={{ y: -2 }}
      className={`flex flex-col rounded-xl overflow-hidden bg-[#0D0D0D] border border-white/10 hover:border-primary/50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="relative w-full h-24 sm:h-28 bg-zinc-900 shrink-0">
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
            <Calendar className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm mb-1.5 line-clamp-2">{event.title}</h3>
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-1">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          {formatEventDate(event.eventDate)}
        </div>
        {locationText && (
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
        )}
        {event.description && (
          <p className="text-zinc-400 text-xs line-clamp-2 flex-1">{event.description}</p>
        )}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                onRegisterClick?.(event);
              }}
              className="inline-flex items-center justify-center py-1.5 px-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg text-xs transition-colors"
            >
              Registrarme
            </a>
          )}
          {onShare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare(event);
              }}
              className="inline-flex items-center gap-1 py-1.5 px-3 border border-white/10 hover:border-primary/50 text-zinc-400 hover:text-white rounded-lg text-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Compartir
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
