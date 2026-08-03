'use client';

import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo producto</h1>
      <ProductForm />
    </div>
  );
}
