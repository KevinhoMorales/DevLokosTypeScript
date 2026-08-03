import { NextRequest, NextResponse } from 'next/server';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { getServicesRef, parseServiceDoc } from '@/lib/firestore-helpers';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getFirestore();
    const snap = await getServicesRef(db).orderBy('order', 'asc').get();
    const services = snap.docs.map((doc) =>
      parseServiceDoc(doc.id, doc.data() as Record<string, unknown>)
    );
    return NextResponse.json({ services });
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
      icon: String(body.icon || '💼'),
      features: Array.isArray(body.features) ? body.features.map(String) : [],
      order: Number(body.order) || 0,
      isPublished: body.isPublished !== false,
    };

    const db = getFirestore();
    const ref = await getServicesRef(db).add(payload);
    const created = await ref.get();
    return NextResponse.json(
      { service: parseServiceDoc(ref.id, created.data() as Record<string, unknown>) },
      { status: 201 }
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
