'use client';

import { PortfolioForm } from '@/components/admin/PortfolioForm';

export default function NewPortfolioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo proyecto</h1>
      <PortfolioForm />
    </div>
  );
}
