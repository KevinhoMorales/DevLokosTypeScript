import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { getPortfolioRef, parsePortfolioDoc } from '@/lib/firestore-helpers';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getFirestore();
    const snap = await getPortfolioRef(db).orderBy('order', 'asc').get();
    const portfolio = snap.docs.map((doc) =>
      parsePortfolioDoc(doc.id, doc.data() as Record<string, unknown>)
    );
    return NextResponse.json({ portfolio });
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
      technologies: Array.isArray(body.technologies) ? body.technologies.map(String) : [],
      category: String(body.category || ''),
      projectUrl: body.projectUrl || null,
      caseStudyUrl: body.caseStudyUrl || null,
      isPublished: body.isPublished !== false,
      order: Number(body.order) || 0,
      createdAt: FieldValue.serverTimestamp(),
    };

    const db = getFirestore();
    const ref = await getPortfolioRef(db).add(payload);
    const created = await ref.get();
    return NextResponse.json(
      { item: parsePortfolioDoc(ref.id, created.data() as Record<string, unknown>) },
      { status: 201 }
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
