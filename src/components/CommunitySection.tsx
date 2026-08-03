'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, X } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';
import { EventCard, type EventCardData, formatEventDate } from '@/components/EventCard';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { SECTION_CONTAINER } from '@/lib/section-layout';
import { motion } from 'framer-motion';

export default function CommunitySection() {
  const [upcoming, setUpcoming] = useState<EventCardData[]>([]);
  const [past, setPast] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventCardData | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUpcoming(data.upcoming ?? []);
      setPast(data.past ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onEscape);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEscape);
    };
  }, [selectedEvent]);

  const eventsListViewedRef = useRef(false);
  const hasEvents = upcoming.length > 0 || past.length > 0;
  useEffect(() => {
    if (!loading && hasEvents && !eventsListViewedRef.current) {
      eventsListViewedRef.current = true;
      analyticsEvents.events_list_viewed();
    }
  }, [loading, hasEvents]);

  const handleSelectEvent = (event: EventCardData) => {
    setSelectedEvent(event);
    analyticsEvents.event_viewed({
      event_id: event.id,
      event_title: event.title,
      city: event.city,
      has_registration_link: !!event.registrationUrl,
    });
  };

  const handleShare = (event: EventCardData) => {
    analyticsEvents.event_shared(event.id, event.title);
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `${event.title} - ${event.eventDate}`;
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text,
        url: event.registrationUrl || url,
      }).catch(() => {});
    } else if (event.registrationUrl) {
      window.open(event.registrationUrl, '_blank');
    }
  };

  const handleRegisterClick = (event: EventCardData) => {
    analyticsEvents.event_register_clicked(event.id, event.title);
  };

  return (
    <section id="events-section" className={`${SECTION_CONTAINER} bg-black`}>
      <SectionIntro>
        Eventos presenciales y virtuales para la comunidad tech. Meetups, charlas y workshops organizados por DevLokos.
      </SectionIntro>
      {loading && (
          <LoadingSkeleton count={8} variant="event" className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" />
        )}

        {error && !loading && (
          <ErrorState title="Algo salió mal" message={error} onRetry={fetchEvents} />
        )}

        {!loading && !error && !hasEvents && (
          <EmptyState
            icon={<Calendar className="w-12 h-12 text-primary" />}
            title="Próximamente"
            subtitle="Estamos preparando eventos."
          />
        )}

        {!loading && !error && hasEvents && (
          <div className="space-y-12">
            {upcoming.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Próximos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {upcoming.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <EventCard event={event} onShare={handleShare} onClick={handleSelectEvent} onRegisterClick={handleRegisterClick} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Pasados</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {past.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <EventCard event={event} onShare={handleShare} onClick={handleSelectEvent} onRegisterClick={handleRegisterClick} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0D0D0D] rounded-2xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {selectedEvent.imageUrl && (
                <div className="relative w-full h-48 sm:h-56 bg-zinc-900 rounded-t-2xl overflow-hidden">
                  <Image
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 512px) 100vw, 512px"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white pr-10 mb-4">{selectedEvent.title}</h2>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <Calendar className="w-4 h-4 shrink-0 text-primary" />
                    {formatEventDate(selectedEvent.eventDate)}
                  </div>
                  {(selectedEvent.city || selectedEvent.location) && (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <MapPin className="w-4 h-4 shrink-0 text-primary" />
                      {[selectedEvent.city, selectedEvent.location].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <div className="mb-6">
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {selectedEvent.registrationUrl && (
                  <a
                    href={selectedEvent.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleRegisterClick(selectedEvent)}
                    className="inline-flex items-center justify-center w-full py-3.5 px-5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors"
                  >
                    Registrarme
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
    </section>
  );
}
