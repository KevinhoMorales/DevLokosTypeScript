'use client';

import { ServiceForm } from '@/components/admin/ServiceForm';

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo servicio</h1>
      <ServiceForm />
    </div>
  );
}
