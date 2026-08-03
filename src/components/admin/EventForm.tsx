'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminEvent } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

function toLocalInput(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ event }: { event?: AdminEvent }) {
  const { getIdToken } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [eventDate, setEventDate] = useState(toLocalInput(event?.eventDate || ''));
  const [location, setLocation] = useState(event?.location || '');
  const [city, setCity] = useState(event?.city || '');
  const [registrationUrl, setRegistrationUrl] = useState(event?.registrationUrl || '');
  const [isActive, setIsActive] = useState(event?.isActive ?? true);
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || '');
  const [token, setToken] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getIdToken().then(setToken);
  }, [getIdToken]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const t = token || (await getIdToken());
      if (!t) throw new Error('Sin sesión');
      const body = {
        title,
        description,
        eventDate: eventDate ? new Date(eventDate).toISOString() : new Date().toISOString(),
        location,
        city,
        registrationUrl,
        isActive,
        imageUrl: imageUrl || null,
      };
      if (event) {
        await adminJson(`/api/admin/events/${event.id}`, t, { method: 'PATCH', body: JSON.stringify(body) });
      } else {
        await adminJson('/api/admin/events', t, { method: 'POST', body: JSON.stringify(body) });
      }
      router.push('/admin/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!event || !confirm('¿Desactivar este evento?')) return;
    const t = token || (await getIdToken());
    if (!t) return;
    await adminJson(`/api/admin/events/${event.id}`, t, { method: 'DELETE' });
    router.push('/admin/events');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <ImageUploadField value={imageUrl} onChange={setImageUrl} token={token} type="event" entityId={event?.id || 'new'} />
      <Field label="Título">
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <Field label="Descripción">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-md bg-black border border-white/10 px-3 py-2 text-sm" />
      </Field>
      <Field label="Fecha y hora">
        <Input type="datetime-local" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ubicación">
          <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-black border-white/10" />
        </Field>
        <Field label="Ciudad">
          <Input value={city} onChange={(e) => setCity(e.target.value)} className="bg-black border-white/10" />
        </Field>
      </div>
      <Field label="URL de registro">
        <Input value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Activo
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
        {event && (
          <Button type="button" variant="outline" className="border-red-500/50 text-red-400" onClick={onDelete}>
            Desactivar
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-400">{label}</label>
      {children}
    </div>
  );
}
