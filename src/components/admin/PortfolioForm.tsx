'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminPortfolio } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export function PortfolioForm({ item }: { item?: AdminPortfolio }) {
  const { getIdToken } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || '');
  const [technologiesText, setTechnologiesText] = useState((item?.technologies || []).join(', '));
  const [projectUrl, setProjectUrl] = useState(item?.projectUrl || '');
  const [caseStudyUrl, setCaseStudyUrl] = useState(item?.caseStudyUrl || '');
  const [order, setOrder] = useState(String(item?.order ?? 0));
  const [isPublished, setIsPublished] = useState(item?.isPublished ?? true);
  const [thumbnailUrl, setThumbnailUrl] = useState(item?.thumbnailUrl || '');
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
        category,
        technologies: technologiesText.split(',').map((s) => s.trim()).filter(Boolean),
        projectUrl: projectUrl || null,
        caseStudyUrl: caseStudyUrl || null,
        order: Number(order) || 0,
        isPublished,
        thumbnailUrl: thumbnailUrl || null,
      };
      if (item) {
        await adminJson(`/api/admin/portfolio/${item.id}`, t, { method: 'PATCH', body: JSON.stringify(body) });
      } else {
        await adminJson('/api/admin/portfolio', t, { method: 'POST', body: JSON.stringify(body) });
      }
      router.push('/admin/portfolio');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!item || !confirm('¿Eliminar proyecto?')) return;
    const t = token || (await getIdToken());
    if (!t) return;
    await adminJson(`/api/admin/portfolio/${item.id}`, t, { method: 'DELETE' });
    router.push('/admin/portfolio');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <ImageUploadField value={thumbnailUrl} onChange={setThumbnailUrl} token={token} type="portfolio" entityId={item?.id || 'new'} />
      <Field label="Título">
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <Field label="Descripción">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-md bg-black border border-white/10 px-3 py-2 text-sm" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoría">
          <Input value={category} onChange={(e) => setCategory(e.target.value)} className="bg-black border-white/10" placeholder="Web, Móvil…" />
        </Field>
        <Field label="Orden">
          <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="bg-black border-white/10" />
        </Field>
      </div>
      <Field label="Tecnologías (separadas por coma)">
        <Input value={technologiesText} onChange={(e) => setTechnologiesText(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <Field label="URL del proyecto">
        <Input value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <Field label="URL del caso de estudio">
        <Input value={caseStudyUrl} onChange={(e) => setCaseStudyUrl(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Publicado
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-primary">{saving ? 'Guardando...' : 'Guardar'}</Button>
        {item && (
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
