import { NextRequest, NextResponse } from 'next/server';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { getProductsRef, parseProductDoc } from '@/lib/firestore-helpers';

type Ctx = { params: Promise<{ id: string }> };

function normalizeStoreLinks(raw: unknown): { label: string; url: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((link) => {
      if (!link || typeof link !== 'object') return null;
      const l = link as { label?: unknown; url?: unknown };
      const label = String(l.label || '').trim();
      const url = String(l.url || '').trim();
      if (!label || !url) return null;
      return { label, url };
    })
    .filter((x): x is { label: string; url: string } => x != null);
}

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const doc = await getProductsRef(getFirestore()).doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    return NextResponse.json({
      item: parseProductDoc(doc.id, doc.data() as Record<string, unknown>),
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
    const ref = getProductsRef(getFirestore()).doc(id);
    if (!(await ref.get()).exists) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = String(body.title).trim();
    if (body.description !== undefined) update.description = String(body.description);
    if (body.thumbnailUrl !== undefined) update.thumbnailUrl = body.thumbnailUrl || null;
    if (body.type !== undefined) update.type = String(body.type || 'other');
    if (body.storeLinks !== undefined) update.storeLinks = normalizeStoreLinks(body.storeLinks);
    if (body.order !== undefined) update.order = Number(body.order) || 0;
    if (body.isPublished !== undefined) update.isPublished = Boolean(body.isPublished);

    await ref.update(update);
    const updated = await ref.get();
    return NextResponse.json({
      item: parseProductDoc(updated.id, updated.data() as Record<string, unknown>),
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const ref = getProductsRef(getFirestore()).doc(id);
    if (!(await ref.get()).exists) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    await ref.delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
