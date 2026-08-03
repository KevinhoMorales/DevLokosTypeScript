'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminJson } from '@/lib/admin-api';
import { DIFFICULTIES, LEARNING_PATHS, type AdminCourse } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Chip } from '@/components/ui/Chip';

type Props = { course?: AdminCourse };

export function CourseForm({ course }: Props) {
  const { getIdToken } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [professor, setProfessor] = useState(course?.professor || '');
  const [duration, setDuration] = useState(String(course?.duration ?? 0));
  const [difficulty, setDifficulty] = useState(course?.difficulty || 'Beginner');
  const [paths, setPaths] = useState<string[]>(course?.learningPaths || []);
  const [isPaid, setIsPaid] = useState(course?.isPaid ?? false);
  const [isPublished, setIsPublished] = useState(course?.isPublished ?? false);
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnailUrl || '');
  const [token, setToken] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getIdToken().then(setToken);
  }, [getIdToken]);

  const togglePath = (p: string) => {
    setPaths((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : prev.length < 5 ? [...prev, p] : prev
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const t = token || (await getIdToken());
      if (!t) throw new Error('Sin sesión');
      const body = {
        title,
        description,
        professor,
        duration: Number(duration) || 0,
        difficulty,
        learningPaths: paths,
        isPaid,
        isPublished,
        thumbnailUrl: thumbnailUrl || null,
      };
      if (course) {
        await adminJson(`/api/admin/courses/${course.id}`, t, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await adminJson('/api/admin/courses', t, {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      router.push('/admin/courses');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!course || !confirm('¿Eliminar este curso permanentemente?')) return;
    const t = token || (await getIdToken());
    if (!t) return;
    await adminJson(`/api/admin/courses/${course.id}`, t, { method: 'DELETE' });
    router.push('/admin/courses');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <ImageUploadField
        value={thumbnailUrl}
        onChange={setThumbnailUrl}
        token={token}
        type="course"
        entityId={course?.id || 'new'}
      />
      <Field label="Título">
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <Field label="Descripción">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md bg-black border border-white/10 px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Profesor">
        <Input value={professor} onChange={(e) => setProfessor(e.target.value)} className="bg-black border-white/10" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Duración (min)">
          <Input type="number" min={0} value={duration} onChange={(e) => setDuration(e.target.value)} className="bg-black border-white/10" />
        </Field>
        <Field label="Dificultad">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full h-10 rounded-md bg-black border border-white/10 px-3 text-sm"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>
      </div>
      <div>
        <p className="text-sm text-zinc-400 mb-2">Rutas de aprendizaje (máx. 5)</p>
        <div className="flex flex-wrap gap-2">
          {LEARNING_PATHS.map((p) => (
            <Chip key={p} type="button" active={paths.includes(p)} onClick={() => togglePath(p)}>
              {p}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!isPaid} onChange={(e) => setIsPaid(!e.target.checked)} />
          Gratis
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Publicado
        </label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
        {course && (
          <Button type="button" variant="outline" className="border-red-500/50 text-red-400" onClick={onDelete}>
            Eliminar
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-400">{label}</label>
      {children}
    </div>
  );
}
