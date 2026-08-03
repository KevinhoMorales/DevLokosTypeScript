import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { getProductsRef, parseProductDoc } from '@/lib/firestore-helpers';

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

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getFirestore();
    const snap = await getProductsRef(db).orderBy('order', 'asc').get();
    const products = snap.docs.map((doc) =>
      parseProductDoc(doc.id, doc.data() as Record<string, unknown>)
    );
    return NextResponse.json({ products });
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

    const payload = {
      title,
      description: String(body.description || ''),
      thumbnailUrl: body.thumbnailUrl || null,
      type: String(body.type || 'other'),
      storeLinks: normalizeStoreLinks(body.storeLinks),
      isPublished: body.isPublished !== false,
      order: Number(body.order) || 0,
      createdAt: FieldValue.serverTimestamp(),
    };

    const db = getFirestore();
    const ref = await getProductsRef(db).add(payload);
    const created = await ref.get();
    return NextResponse.json(
      { item: parseProductDoc(ref.id, created.data() as Record<string, unknown>) },
      { status: 201 }
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
