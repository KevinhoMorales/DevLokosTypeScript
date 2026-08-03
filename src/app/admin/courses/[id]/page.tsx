'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import type { AdminCourse } from '@/lib/admin-types';
import { CourseForm } from '@/components/admin/CourseForm';
import { AppLoading } from '@/components/admin/AdminLoading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { getIdToken } = useAuth();
  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getIdToken();
        if (!token) throw new Error('Sin sesión');
        const data = await adminJson<{ course: AdminCourse }>(`/api/admin/courses/${id}`, token);
        setCourse(data.course);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error');
      }
    })();
  }, [id, getIdToken]);

  if (error) return <EmptyState title="Error" subtitle={error} />;
  if (!course) return <AppLoading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar curso</h1>
      <CourseForm course={course} />
    </div>
  );
}
