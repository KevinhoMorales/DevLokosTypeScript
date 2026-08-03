/**
 * Roles de acceso de cuenta (permisos de app).
 * Distinto del campo de perfil `role` (cargo laboral, texto libre).
 *
 * Persistido en Firestore: `{FIREBASE_ENV}/{FIREBASE_ENV}/users/{uid}.accountRole`
 * Al registrarse en la app siempre se escribe `user`. Elevaciones solo Console / Admin SDK.
 *
 * El CMS web (`/admin`) sigue autorizando con la colección `{env}/{env}/admin` (email),
 * no con accountRole — ver auth-admin.ts.
 */
export type AccountRole = 'user' | 'member' | 'admin';

export const ACCOUNT_ROLES: readonly AccountRole[] = ['user', 'member', 'admin'] as const;

export const DEFAULT_ACCOUNT_ROLE: AccountRole = 'user';

export function parseAccountRole(value: unknown): AccountRole {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if ((ACCOUNT_ROLES as readonly string[]).includes(normalized)) {
      return normalized as AccountRole;
    }
  }
  return DEFAULT_ACCOUNT_ROLE;
}

export function isMemberOrAbove(role: AccountRole): boolean {
  return role === 'member' || role === 'admin';
}

export function isAccountAdmin(role: AccountRole): boolean {
  return role === 'admin';
}
