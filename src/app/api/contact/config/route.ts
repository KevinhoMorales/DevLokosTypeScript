import { NextResponse } from 'next/server';
import { getRemoteConfigValue } from '@/lib/firebase-admin';

/**
 * GET: devuelve la access key de Web3Forms (Remote Config o env) para que
 * el cliente envíe el formulario desde el navegador y evite 403 de Cloudflare.
 */
export async function GET() {
  const apiKey =
    (await getRemoteConfigValue('web_3_form').catch(() => null)) ||
    (process.env.WEB3FORMS_ACCESS_KEY ?? '').trim();
  if (!apiKey) {
    return NextResponse.json({ error: 'Formulario no configurado' }, { status: 503 });
  }
  return NextResponse.json({ accessKey: apiKey });
}
