import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { getCoursesRef, parseCourseDoc } from '@/lib/firestore-helpers';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const db = getFirestore();
    const doc = await getCoursesRef(db).doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }
    return NextResponse.json({
      course: parseCourseDoc(doc.id, doc.data() as Record<string, unknown>),
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const body = await req.json();
    const db = getFirestore();
    const ref = getCoursesRef(db).doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const prev = existing.data() as Record<string, unknown>;
    const isPublished =
      body.isPublished !== undefined ? Boolean(body.isPublished) : Boolean(prev.isPublished);

    const update: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (body.title !== undefined) update.title = String(body.title).trim();
    if (body.description !== undefined) update.description = String(body.description);
    if (body.difficulty !== undefined) update.difficulty = String(body.difficulty);
    if (body.duration !== undefined) update.duration = Number(body.duration) || 0;
    if (body.thumbnailUrl !== undefined) update.thumbnailUrl = body.thumbnailUrl || null;
    if (body.learningPaths !== undefined) update.learningPaths = body.learningPaths;
    if (body.learningObjectives !== undefined) update.learningObjectives = body.learningObjectives;
    if (body.modules !== undefined) update.modules = body.modules;
    if (body.professor !== undefined) update.professor = body.professor || null;
    if (body.link !== undefined) update.link = body.link;
    if (body.isPaid !== undefined) update.isPaid = Boolean(body.isPaid);
    if (body.price !== undefined) update.price = body.price;
    if (body.isPublished !== undefined) {
      update.isPublished = isPublished;
      if (isPublished && !prev.publishedAt) {
        update.publishedAt = FieldValue.serverTimestamp();
      }
      if (!isPublished) {
        update.publishedAt = null;
      }
    }

    await ref.update(update);
    const updated = await ref.get();
    return NextResponse.json({
      course: parseCourseDoc(updated.id, updated.data() as Record<string, unknown>),
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const db = getFirestore();
    const ref = getCoursesRef(db).doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }
    await ref.delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
