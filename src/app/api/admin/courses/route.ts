import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { getCoursesRef, parseCourseDoc } from '@/lib/firestore-helpers';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getFirestore();
    const snap = await getCoursesRef(db).orderBy('createdAt', 'desc').get();
    const courses = snap.docs.map((doc) =>
      parseCourseDoc(doc.id, doc.data() as Record<string, unknown>)
    );
    return NextResponse.json({ courses });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const title = String(body.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 });
    }

    const isPublished = Boolean(body.isPublished);
    const now = FieldValue.serverTimestamp();
    const payload = {
      title,
      description: String(body.description || ''),
      learningObjectives: Array.isArray(body.learningObjectives) ? body.learningObjectives : [],
      difficulty: String(body.difficulty || 'Beginner'),
      duration: Number(body.duration) || 0,
      thumbnailUrl: body.thumbnailUrl || null,
      learningPaths: Array.isArray(body.learningPaths) ? body.learningPaths : [],
      modules: Array.isArray(body.modules) ? body.modules : [],
      finalProjectId: body.finalProjectId || null,
      isPublished,
      isPaid: Boolean(body.isPaid),
      price: body.price ?? null,
      createdAt: now,
      updatedAt: now,
      publishedAt: isPublished ? now : null,
      enrollmentCount: 0,
      professor: body.professor ? String(body.professor) : null,
      link: body.link ?? null,
    };

    const db = getFirestore();
    const ref = await getCoursesRef(db).add(payload);
    const created = await ref.get();
    return NextResponse.json(
      { course: parseCourseDoc(ref.id, created.data() as Record<string, unknown>) },
      { status: 201 }
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
