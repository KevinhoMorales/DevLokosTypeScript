'use client';

import Link from 'next/link';
import { BookOpen, Calendar, Briefcase, Layers } from 'lucide-react';

const modules = [
  {
    href: '/admin/courses',
    title: 'Cursos',
    description: 'CRUD de Academia: publicar, editar y eliminar cursos.',
    icon: BookOpen,
  },
  {
    href: '/admin/events',
    title: 'Eventos',
    description: 'Gestiona meetups y workshops. Eliminar = desactivar.',
    icon: Calendar,
  },
  {
    href: '/admin/services',
    title: 'Servicios',
    description: 'Servicios del módulo Empresarial.',
    icon: Briefcase,
  },
  {
    href: '/admin/portfolio',
    title: 'Portfolio',
    description: 'Proyectos destacados del módulo Empresarial.',
    icon: Layers,
  },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Panel de administración</h1>
        <p className="text-zinc-400 mt-2">
          Gestiona el contenido de DevLokos. Los cambios se reflejan en la app y en la web.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 hover:border-primary/50 transition-colors"
          >
            <m.icon className="w-8 h-8 text-primary mb-3" />
            <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {m.title}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">{m.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
