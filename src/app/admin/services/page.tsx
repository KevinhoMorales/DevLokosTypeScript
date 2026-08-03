'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminService } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import { AppLoading } from '@/components/admin/AdminLoading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminServicesPage() {
  const { getIdToken } = useAuth();
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      if (!token) throw new Error('Sin sesión');
      const data = await adminJson<{ services: AdminService[] }>('/api/admin/services', token);
      setServices(data.services);
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
        <h1 className="text-2xl font-bold">Servicios</h1>
        <Button asChild className="bg-primary">
          <Link href="/admin/services/new">Nuevo servicio</Link>
        </Button>
      </div>
      {loading && <AppLoading />}
      {error && <EmptyState title="Error" subtitle={error} action={<Button onClick={load}>Reintentar</Button>} />}
      {!loading && !error && services.length === 0 && <EmptyState title="Sin servicios" subtitle="Crea el primero." />}
      {!loading && services.length > 0 && (
        <ul className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
          {services.map((s) => (
            <li key={s.id}>
              <Link href={`/admin/services/${s.id}`} className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-white/5">
                <div>
                  <p className="font-medium">{s.icon} {s.title}</p>
                  <p className="text-xs text-zinc-500">Orden {s.order}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${s.isPublished ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
                  {s.isPublished ? 'Publicado' : 'Oculto'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
