'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminService } from '@/lib/admin-types';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { AppLoading } from '@/components/admin/AdminLoading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const { getIdToken } = useAuth();
  const [service, setService] = useState<AdminService | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getIdToken();
        if (!token) throw new Error('Sin sesión');
        const data = await adminJson<{ service: AdminService }>(`/api/admin/services/${id}`, token);
        setService(data.service);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error');
      }
    })();
  }, [id, getIdToken]);

  if (error) return <EmptyState title="Error" subtitle={error} />;
  if (!service) return <AppLoading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar servicio</h1>
      <ServiceForm service={service} />
    </div>
  );
}
