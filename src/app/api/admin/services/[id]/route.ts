import { NextRequest, NextResponse } from 'next/server';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { getServicesRef, parseServiceDoc } from '@/lib/firestore-helpers';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const doc = await getServicesRef(getFirestore()).doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    return NextResponse.json({
      service: parseServiceDoc(doc.id, doc.data() as Record<string, unknown>),
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
    const ref = getServicesRef(getFirestore()).doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }

    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = String(body.title).trim();
    if (body.description !== undefined) update.description = String(body.description);
    if (body.icon !== undefined) update.icon = String(body.icon);
    if (body.features !== undefined) update.features = body.features;
    if (body.order !== undefined) update.order = Number(body.order) || 0;
    if (body.isPublished !== undefined) update.isPublished = Boolean(body.isPublished);

    await ref.update(update);
    const updated = await ref.get();
    return NextResponse.json({
      service: parseServiceDoc(updated.id, updated.data() as Record<string, unknown>),
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const ref = getServicesRef(getFirestore()).doc(id);
    if (!(await ref.get()).exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    await ref.delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
