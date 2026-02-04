import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { getEventsRef, parseEventDoc, isEventPast } from '@/lib/firestore-helpers';

export interface EventDoc {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  eventDate: string;
  location?: string;
  city?: string;
  registrationUrl?: string;
}

export async function GET() {
  try {
    const db = getFirestore();
    const snapshot = await getEventsRef(db).get();

    const events = snapshot.docs
      .map((doc) => parseEventDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((e) => e.isActive)
      .map(({ id, title, description, imageUrl, eventDate, location, city, registrationUrl }) => ({
        id,
        title,
        description,
        imageUrl,
        eventDate: typeof eventDate === 'string' ? eventDate : new Date(eventDate).toISOString(),
        location,
        city,
        registrationUrl,
      }));

    const eventDateValue = (e: EventDoc) => new Date(e.eventDate).getTime();

    const upcoming = events
      .filter((e) => !isEventPast(e.eventDate))
      .sort((a, b) => eventDateValue(a) - eventDateValue(b));

    const past = events
      .filter((e) => isEventPast(e.eventDate))
      .sort((a, b) => eventDateValue(b) - eventDateValue(a));

    return NextResponse.json({ events: [...upcoming, ...past], upcoming, past });
  } catch (e) {
    console.error('events', e);
    return NextResponse.json(
      { events: [], upcoming: [], past: [], error: String(e) },
      { status: 500 }
    );
  }
}
