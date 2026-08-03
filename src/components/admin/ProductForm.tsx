'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminProduct } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

type StoreLinkRow = { label: string; url: string };

export function ProductForm({ item }: { item?: AdminProduct }) {
  const { getIdToken } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [type, setType] = useState(item?.type || 'book');
  const [order, setOrder] = useState(String(item?.order ?? 0));
  const [isPublished, setIsPublished] = useState(item?.isPublished ?? true);
  const [thumbnailUrl, setThumbnailUrl] = useState(item?.thumbnailUrl || '');
  const [storeLinks, setStoreLinks] = useState<StoreLinkRow[]>(
    item?.storeLinks?.length
      ? item.storeLinks
      : [
          { label: 'Amazon', url: '' },
          { label: 'Gumroad', url: '' },
        ]
  );
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
        type,
        order: Number(order) || 0,
        isPublished,
        thumbnailUrl: thumbnailUrl || null,
        storeLinks: storeLinks.filter((l) => l.label.trim() && l.url.trim()),
      };
      if (item) {
        await adminJson(`/api/admin/products/${item.id}`, t, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await adminJson('/api/admin/products', t, {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!item || !confirm('¿Eliminar producto?')) return;
    const t = token || (await getIdToken());
    if (!t) return;
    await adminJson(`/api/admin/products/${item.id}`, t, { method: 'DELETE' });
    router.push('/admin/products');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <ImageUploadField
        value={thumbnailUrl}
        onChange={setThumbnailUrl}
        token={token}
        type="product"
        entityId={item?.id || 'new'}
      />
      <Field label="Título">
        <Input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-black border-white/10"
        />
      </Field>
      <Field label="Descripción">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md bg-black border border-white/10 px-3 py-2 text-sm"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipo">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md bg-black border border-white/10 px-3 py-2 text-sm"
          >
            <option value="book">Libro</option>
            <option value="digital">Digital</option>
            <option value="other">Otro</option>
          </select>
        </Field>
        <Field label="Orden">
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="bg-black border-white/10"
          />
        </Field>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-zinc-400">Enlaces de tienda</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/10"
            onClick={() => setStoreLinks((prev) => [...prev, { label: '', url: '' }])}
          >
            Añadir enlace
          </Button>
        </div>
        {storeLinks.map((link, index) => (
          <div key={index} className="grid grid-cols-[1fr_2fr_auto] gap-2">
            <Input
              placeholder="Etiqueta"
              value={link.label}
              onChange={(e) => {
                const next = [...storeLinks];
                next[index] = { ...next[index], label: e.target.value };
                setStoreLinks(next);
              }}
              className="bg-black border-white/10"
            />
            <Input
              placeholder="https://"
              value={link.url}
              onChange={(e) => {
                const next = [...storeLinks];
                next[index] = { ...next[index], url: e.target.value };
                setStoreLinks(next);
              }}
              className="bg-black border-white/10"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-red-500/40 text-red-400"
              onClick={() => setStoreLinks((prev) => prev.filter((_, i) => i !== index))}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        Publicado
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-primary">
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
        {item && (
          <Button
            type="button"
            variant="outline"
            className="border-red-500/50 text-red-400"
            onClick={onDelete}
          >
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
