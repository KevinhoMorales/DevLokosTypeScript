'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminService } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ServiceForm({ service }: { service?: AdminService }) {
  const { getIdToken } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState(service?.title || '');
  const [description, setDescription] = useState(service?.description || '');
  const [icon, setIcon] = useState(service?.icon || '💼');
  const [featuresText, setFeaturesText] = useState((service?.features || []).join('\n'));
  const [order, setOrder] = useState(String(service?.order ?? 0));
  const [isPublished, setIsPublished] = useState(service?.isPublished ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const t = await getIdToken();
      if (!t) throw new Error('Sin sesión');
      const body = {
        title,
        description,
        icon,
        features: featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
        order: Number(order) || 0,
        isPublished,
      };
      if (service) {
        await adminJson(`/api/admin/services/${service.id}`, t, { method: 'PATCH', body: JSON.stringify(body) });
      } else {
        await adminJson('/api/admin/services', t, { method: 'POST', body: JSON.stringify(body) });
      }
      router.push('/admin/services');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!service || !confirm('¿Eliminar servicio?')) return;
    const t = await getIdToken();
    if (!t) return;
    await adminJson(`/api/admin/services/${service.id}`, t, { method: 'DELETE' });
    router.push('/admin/services');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <Field label="Título">
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <Field label="Descripción">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-md bg-black border border-white/10 px-3 py-2 text-sm" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Icono (emoji o texto)">
          <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="bg-black border-white/10" />
        </Field>
        <Field label="Orden">
          <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="bg-black border-white/10" />
        </Field>
      </div>
      <Field label="Características (una por línea)">
        <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={5} className="w-full rounded-md bg-black border border-white/10 px-3 py-2 text-sm font-mono" />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Publicado
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-primary">{saving ? 'Guardando...' : 'Guardar'}</Button>
        {service && (
          <Button type="button" variant="outline" className="border-red-500/50 text-red-400" onClick={onDelete}>
            Eliminar
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
