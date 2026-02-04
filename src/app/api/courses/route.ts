import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { getCoursesRef, parseCourseDoc } from '@/lib/firestore-helpers';

export interface CourseDoc {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  difficulty?: string;
  duration?: number;
  learningPaths?: string[];
  modules?: { id?: string; title?: string; description?: string; order?: number }[];
  learningObjectives?: string[];
  professor?: string;
  link?: string;
}

export async function GET() {
  try {
    const db = getFirestore();
    const snapshot = await getCoursesRef(db).get();

    const parsed = snapshot.docs.map((doc) =>
      parseCourseDoc(doc.id, doc.data() as Record<string, unknown>)
    );

    const courses: CourseDoc[] = parsed
      .filter((c) => c.isPublished)
      .sort((a, b) => {
        const aAt = a.publishedAt || a.createdAt;
        const bAt = b.publishedAt || b.createdAt;
        const aTime = aAt instanceof Date ? aAt.getTime() : 0;
        const bTime = bAt instanceof Date ? bAt.getTime() : 0;
        return bTime - aTime;
      })
      .map(
        ({
          id,
          title,
          description,
          thumbnailUrl,
          difficulty,
          duration,
          learningPaths,
          modules,
          learningObjectives,
          professor,
          link,
        }) => ({
          id,
          title,
          description,
          thumbnailUrl,
          difficulty,
          duration,
          learningPaths,
          modules,
          learningObjectives,
          professor,
          link,
        })
      );

    return NextResponse.json({ courses });
  } catch (e) {
    console.error('courses', e);
    return NextResponse.json({ courses: [], error: String(e) }, { status: 500 });
  }
}
