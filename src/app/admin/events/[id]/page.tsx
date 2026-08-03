'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminEvent } from '@/lib/admin-types';
import { EventForm } from '@/components/admin/EventForm';
import { AppLoading } from '@/components/admin/AdminLoading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const { getIdToken } = useAuth();
  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getIdToken();
        if (!token) throw new Error('Sin sesión');
        const data = await adminJson<{ event: AdminEvent }>(`/api/admin/events/${id}`, token);
        setEvent(data.event);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error');
      }
    })();
  }, [id, getIdToken]);

  if (error) return <EmptyState title="Error" subtitle={error} />;
  if (!event) return <AppLoading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar evento</h1>
      <EventForm event={event} />
    </div>
  );
}
