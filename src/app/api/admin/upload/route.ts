import { NextRequest, NextResponse } from 'next/server';
import { authErrorResponse, requireAdmin } from '@/lib/auth-admin';
import { getStorageBucket } from '@/lib/firebase-admin';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const form = await req.formData();
    const file = form.get('file');
    const type = String(form.get('type') || 'course');
    const entityId = String(form.get('entityId') || 'tmp');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido (jpg, png, webp)' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Máximo 5 MB' }, { status: 400 });
    }

    const ext =
      file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg';
    const ts = Date.now();
    let path: string;
    if (type === 'event') {
      path = `events/images/event_${entityId}_${ts}${ext}`;
    } else if (type === 'portfolio') {
      path = `portfolio/images/portfolio_${entityId}_${ts}${ext}`;
    } else if (type === 'product') {
      path = `products/images/product_${entityId}_${ts}${ext}`;
    } else {
      path = `courses/covers/cover_${entityId}_${ts}${ext}`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = getStorageBucket();
    const gcsFile = bucket.file(path);
    await gcsFile.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      },
      resumable: false,
    });
    await gcsFile.makePublic().catch(() => {
      // Si el bucket no permite makePublic, usamos signed URL larga
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;
    // Fallback token URL style used by Firebase
    const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media`;

    return NextResponse.json({ url: firebaseUrl, publicUrl, path });
  } catch (error) {
    return authErrorResponse(error);
  }
}
