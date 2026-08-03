'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminProduct } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import { AppLoading } from '@/components/admin/AdminLoading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminProductsPage() {
  const { getIdToken } = useAuth();
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      if (!token) throw new Error('Sin sesión');
      const data = await adminJson<{ products: AdminProduct[] }>('/api/admin/products', token);
      setItems(data.products);
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
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button asChild className="bg-primary">
          <Link href="/admin/products/new">Nuevo producto</Link>
        </Button>
      </div>
      {loading && <AppLoading />}
      {error && (
        <EmptyState title="Error" subtitle={error} action={<Button onClick={load}>Reintentar</Button>} />
      )}
      {!loading && !error && items.length === 0 && (
        <EmptyState title="Sin productos" subtitle="Crea el primero o corre npm run seed:products." />
      )}
      {!loading && items.length > 0 && (
        <ul className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
          {items.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/products/${p.id}`}
                className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-white/5"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-zinc-500">
                    {p.type || 'other'} · Orden {p.order} · {p.storeLinks?.length || 0} enlaces
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    p.isPublished ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {p.isPublished ? 'Publicado' : 'Oculto'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
