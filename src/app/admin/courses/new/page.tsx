'use client';

import { CourseForm } from '@/components/admin/CourseForm';

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo curso</h1>
      <CourseForm />
    </div>
  );
}
