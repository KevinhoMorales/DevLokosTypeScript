import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

export interface PortfolioDoc {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  technologies?: string[];
  category?: string;
  order?: number;
}

export async function GET() {
  try {
    const db = getFirestore();
    const snap = await db.collection('portfolio').where('isPublished', '==', true).get();
    const portfolio: PortfolioDoc[] = snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title ?? '',
          description: d.description,
          thumbnailUrl: d.thumbnailUrl,
          technologies: d.technologies ?? [],
          category: d.category,
          order: d.order ?? 0,
        };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return NextResponse.json({ portfolio });
  } catch (e) {
    console.error('portfolio', e);
    return NextResponse.json({ portfolio: [], error: String(e) }, { status: 500 });
  }
}
