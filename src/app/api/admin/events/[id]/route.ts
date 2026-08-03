import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { getEventsRef, parseEventDoc } from '@/lib/firestore-helpers';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const db = getFirestore();
    const doc = await getEventsRef(db).doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }
    return NextResponse.json({
      event: parseEventDoc(doc.id, doc.data() as Record<string, unknown>),
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
    const ref = getEventsRef(db).doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = String(body.title).trim();
    if (body.description !== undefined) update.description = String(body.description);
    if (body.imageUrl !== undefined) update.imageUrl = body.imageUrl || null;
    if (body.location !== undefined) update.location = body.location || null;
    if (body.city !== undefined) update.city = body.city || null;
    if (body.registrationUrl !== undefined) update.registrationUrl = body.registrationUrl || null;
    if (body.isActive !== undefined) update.isActive = Boolean(body.isActive);
    if (body.eventDate !== undefined) {
      update.eventDate = Timestamp.fromDate(new Date(body.eventDate));
    }

    await ref.update(update);
    const updated = await ref.get();
    return NextResponse.json({
      event: parseEventDoc(updated.id, updated.data() as Record<string, unknown>),
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

/** Soft delete: isActive = false */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const db = getFirestore();
    const ref = getEventsRef(db).doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }
    await ref.update({ isActive: false });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
