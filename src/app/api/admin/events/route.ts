import { NextRequest, NextResponse } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { getEventsRef, parseEventDoc } from '@/lib/firestore-helpers';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getFirestore();
    const snap = await getEventsRef(db).orderBy('eventDate', 'desc').get();
    const events = snap.docs.map((doc) =>
      parseEventDoc(doc.id, doc.data() as Record<string, unknown>)
    );
    return NextResponse.json({ events });
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

    const eventDate = body.eventDate
      ? Timestamp.fromDate(new Date(body.eventDate))
      : Timestamp.now();

    const payload = {
      title,
      description: String(body.description || ''),
      imageUrl: body.imageUrl || null,
      eventDate,
      location: body.location ? String(body.location) : null,
      city: body.city ? String(body.city) : null,
      registrationUrl: body.registrationUrl ? String(body.registrationUrl) : null,
      isActive: body.isActive !== false,
      createdAt: FieldValue.serverTimestamp(),
    };

    const db = getFirestore();
    const ref = await getEventsRef(db).add(payload);
    const created = await ref.get();
    return NextResponse.json(
      { event: parseEventDoc(ref.id, created.data() as Record<string, unknown>) },
      { status: 201 }
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
