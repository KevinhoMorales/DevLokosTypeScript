import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export interface ServiceDoc {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  features?: string[];
  order?: number;
}

export async function GET() {
  try {
    const db = getFirestore();
    const snap = await db.collection('services').where('isPublished', '==', true).get();
    const services: ServiceDoc[] = snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title ?? '',
          description: d.description,
          icon: d.icon,
          features: d.features ?? [],
          order: d.order ?? 0,
        };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return NextResponse.json({ services });
  } catch (e) {
    console.error('services', e);
    return NextResponse.json({ services: [], error: String(e) }, { status: 500 });
  }
}
