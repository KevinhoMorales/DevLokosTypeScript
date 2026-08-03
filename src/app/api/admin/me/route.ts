import { NextRequest, NextResponse } from 'next/server';
import { authErrorResponse, requireAdmin, verifyIdToken, isAdminEmail } from '@/lib/auth-admin';

export async function GET(req: NextRequest) {
  try {
    const decoded = await verifyIdToken(req);
    const email = (decoded.email || '').toLowerCase().trim();
    const admin = await isAdminEmail(email);
    return NextResponse.json({
      uid: decoded.uid,
      email,
      isAdmin: admin,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

/** Endpoint de smoke test: confirma que el caller es admin (403 si no). */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    return NextResponse.json({ ok: true, email: admin.email });
  } catch (error) {
    return authErrorResponse(error);
  }
}
