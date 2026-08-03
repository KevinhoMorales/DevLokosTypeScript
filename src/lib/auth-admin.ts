import { NextRequest, NextResponse } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import { getFirestore } from '@/lib/firebase-admin';
import { FIREBASE_ENV } from '@/lib/firestore-helpers';

/**
 * Autorización del CMS web.
 *
 * Hoy: email presente en `{FIREBASE_ENV}/{FIREBASE_ENV}/admin`.
 * La app móvil también guarda `accountRole` en `users/{uid}` (`user`|`member`|`admin`);
 * ese campo NO sustituye aún esta colección para el panel `/admin`.
 */

export class AuthAdminError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getAdminAuth() {
  // Asegura init vía getFirestore (mismo singleton)
  getFirestore();
  return admin.auth();
}

export function extractBearerToken(req: NextRequest | Request): string | null {
  const header = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function verifyIdToken(req: NextRequest | Request): Promise<DecodedIdToken> {
  const token = extractBearerToken(req);
  if (!token) {
    throw new AuthAdminError('No autorizado. Falta token.', 401);
  }
  try {
    return await getAdminAuth().verifyIdToken(token);
  } catch {
    throw new AuthAdminError('Token inválido o expirado.', 401);
  }
}

export async function isAdminEmail(email: string | undefined | null): Promise<boolean> {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  const db = getFirestore();
  const snap = await db
    .collection(FIREBASE_ENV)
    .doc(FIREBASE_ENV)
    .collection('admin')
    .where('email', '==', normalized)
    .limit(1)
    .get();
  return !snap.empty;
}

export type AdminContext = {
  uid: string;
  email: string;
  token: DecodedIdToken;
};

/** Verifica Bearer token + email en colección admin. */
export async function requireAdmin(req: NextRequest | Request): Promise<AdminContext> {
  const decoded = await verifyIdToken(req);
  const email = (decoded.email || '').toLowerCase().trim();
  if (!email) {
    throw new AuthAdminError('La cuenta no tiene email.', 403);
  }
  const ok = await isAdminEmail(email);
  if (!ok) {
    throw new AuthAdminError('No tienes permisos de administrador.', 403);
  }
  return { uid: decoded.uid, email, token: decoded };
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthAdminError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error('[auth-admin]', error);
  return NextResponse.json({ error: 'Error de autenticación' }, { status: 500 });
}
