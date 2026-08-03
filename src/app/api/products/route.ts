import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { getProductsRef, parseProductDoc } from '@/lib/firestore-helpers';

export async function GET() {
  try {
    const db = getFirestore();
    const snap = await getProductsRef(db).get();
    const products = snap.docs
      .map((doc) => parseProductDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((p) => p.isPublished)
      .sort((a, b) => a.order - b.order);
    return NextResponse.json({ products });
  } catch (e) {
    console.error('products', e);
    return NextResponse.json({ products: [], error: String(e) }, { status: 500 });
  }
}
