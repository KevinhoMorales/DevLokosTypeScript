'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { adminFetch } from '@/lib/admin-api';

type Props = {
  value?: string;
  onChange: (url: string) => void;
  token: string | null;
  type: 'course' | 'event' | 'portfolio' | 'product';
  entityId?: string;
};

export function ImageUploadField({ value, onChange, token, type, entityId = 'new' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File | null) => {
    if (!file || !token) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('type', type);
      form.append('entityId', entityId);
      const res = await adminFetch('/api/admin/upload', token, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir');
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm text-zinc-400">Imagen</label>
      {value ? (
        <div className="relative w-full max-w-sm h-40 rounded-xl overflow-hidden border border-white/10 bg-zinc-900">
          <Image src={value} alt="Portada" fill className="object-cover" unoptimized sizes="400px" />
        </div>
      ) : (
        <div className="w-full max-w-sm h-40 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-zinc-500 text-sm">
          Sin imagen
        </div>
      )}
      <div className="flex gap-2 items-center">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading || !token}
          onChange={(e) => onFile(e.target.files?.[0] || null)}
          className="text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:text-white file:px-3 file:py-1.5"
        />
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
            Quitar
          </Button>
        )}
      </div>
      {uploading && <p className="text-xs text-primary">Subiendo...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
