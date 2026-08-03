'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminCourse } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import { AppLoading } from '@/components/admin/AdminLoading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminCoursesPage() {
  const { getIdToken } = useAuth();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) throw new Error('Sin sesión');
      const data = await adminJson<{ courses: AdminCourse[] }>('/api/admin/courses', token);
      setCourses(data.courses);
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
        <h1 className="text-2xl font-bold">Cursos</h1>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/admin/courses/new">Nuevo curso</Link>
        </Button>
      </div>
      {loading && <AppLoading />}
      {error && (
        <EmptyState title="Error" subtitle={error} action={<Button onClick={load}>Reintentar</Button>} />
      )}
      {!loading && !error && courses.length === 0 && (
        <EmptyState title="Sin cursos" subtitle="Crea el primero." />
      )}
      {!loading && courses.length > 0 && (
        <ul className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
          {courses.map((c) => (
            <li key={c.id}>
              <Link
                href={`/admin/courses/${c.id}`}
                className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-white/5"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{c.title}</p>
                  <p className="text-xs text-zinc-500">
                    {c.difficulty} · {c.duration || 0} min · {c.professor || 'Sin profesor'}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                    c.isPublished
                      ? 'bg-primary/20 text-primary'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {c.isPublished ? 'Publicado' : 'Borrador'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
