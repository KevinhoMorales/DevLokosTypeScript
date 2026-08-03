'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminProduct } from '@/lib/admin-types';
import { ProductForm } from '@/components/admin/ProductForm';
import { AppLoading } from '@/components/admin/AdminLoading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';

export default function EditProductPage() {
  const params = useParams();
  const id = String(params.id || '');
  const { getIdToken } = useAuth();
  const [item, setItem] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = await getIdToken();
        if (!token) throw new Error('Sin sesión');
        const data = await adminJson<{ item: AdminProduct }>(`/api/admin/products/${id}`, token);
        setItem(data.item);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error');
      } finally {
        setLoading(false);
      }
    };
    if (id) void load();
  }, [id, getIdToken]);

  if (loading) return <AppLoading />;
  if (error || !item) {
    return (
      <EmptyState
        title="No se pudo cargar"
        subtitle={error || 'Producto no encontrado'}
        action={
          <Button asChild>
            <a href="/admin/products">Volver</a>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar producto</h1>
      <ProductForm item={item} />
    </div>
  );
}
