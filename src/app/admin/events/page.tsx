'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminEvent } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import { AppLoading } from '@/components/admin/AdminLoading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminEventsPage() {
  const { getIdToken } = useAuth();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) throw new Error('Sin sesión');
      const data = await adminJson<{ events: AdminEvent[] }>('/api/admin/events', token);
      setEvents(data.events);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <Button asChild className="bg-primary">
          <Link href="/admin/events/new">Nuevo evento</Link>
        </Button>
      </div>
      {loading && <AppLoading />}
      {error && <EmptyState title="Error" subtitle={error} action={<Button onClick={load}>Reintentar</Button>} />}
      {!loading && !error && events.length === 0 && <EmptyState title="Sin eventos" subtitle="Crea el primero." />}
      {!loading && events.length > 0 && (
        <ul className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
          {events.map((ev) => (
            <li key={ev.id}>
              <Link href={`/admin/events/${ev.id}`} className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-white/5">
                <div className="min-w-0">
                  <p className="font-medium truncate">{ev.title}</p>
                  <p className="text-xs text-zinc-500">
                    {ev.eventDate ? new Date(ev.eventDate).toLocaleString('es') : 'Sin fecha'}
                    {ev.city ? ` · ${ev.city}` : ''}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${ev.isActive ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
                  {ev.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
