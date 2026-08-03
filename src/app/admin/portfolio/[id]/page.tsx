'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminPortfolio } from '@/lib/admin-types';
import { PortfolioForm } from '@/components/admin/PortfolioForm';
import { AppLoading } from '@/components/admin/AdminLoading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function EditPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const { getIdToken } = useAuth();
  const [item, setItem] = useState<AdminPortfolio | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getIdToken();
        if (!token) throw new Error('Sin sesión');
        const data = await adminJson<{ item: AdminPortfolio }>(`/api/admin/portfolio/${id}`, token);
        setItem(data.item);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error');
      }
    })();
  }, [id, getIdToken]);

  if (error) return <EmptyState title="Error" subtitle={error} />;
  if (!item) return <AppLoading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar proyecto</h1>
      <PortfolioForm item={item} />
    </div>
  );
}
