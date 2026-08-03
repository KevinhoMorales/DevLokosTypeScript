'use client';

/** Fetch autenticado contra /api/admin/* con Bearer token. */
export async function adminFetch(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(path, { ...init, headers });
}

export async function adminJson<T>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await adminFetch(path, token, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Error ${res.status}`);
  }
  return data as T;
}
