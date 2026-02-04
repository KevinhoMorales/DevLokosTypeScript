'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { EventCard, type EventCardData } from '@/components/EventCard';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { SECTION_CONTAINER } from '@/lib/section-layout';
import { motion } from 'framer-motion';

export default function CommunitySection() {
  const [upcoming, setUpcoming] = useState<EventCardData[]>([]);
  const [past, setPast] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleShare = (event: EventCardData) => {
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

  const hasEvents = upcoming.length > 0 || past.length > 0;

  return (
    <section id="events-section" className={`${SECTION_CONTAINER} bg-black`}>
      <SectionIntro>
        Eventos presenciales y virtuales para la comunidad tech. Meetups, charlas y workshops organizados por DevLokos.
      </SectionIntro>
      {loading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <EmptyState
            title="Algo salió mal"
            subtitle={error}
            action={
              <Button onClick={fetchEvents} className="bg-primary hover:bg-primary/90 text-white">
                Reintentar
              </Button>
            }
          />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcoming.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <EventCard event={event} onShare={handleShare} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Pasados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {past.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <EventCard event={event} onShare={handleShare} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
    </section>
  );
}
