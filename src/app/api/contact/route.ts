import { NextRequest, NextResponse } from 'next/server';
import { getRemoteConfigValue } from '@/lib/firebase-admin';

const PROJECT_TYPES = [
  'Desarrollo de software a medida',
  'Consultoría',
  'Desarrollo de aplicaciones móviles',
  'Desarrollo web',
  'DevOps e infraestructura',
  'Otro',
];

export async function POST(request: NextRequest) {
  const apiKey = (await getRemoteConfigValue('web_3_form').catch(() => null))
    || (process.env.WEB3FORMS_ACCESS_KEY ?? '').trim();
  if (!apiKey) {
    return NextResponse.json({ error: 'Formulario no configurado' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, company, projectType, message } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !company?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }
    if (!projectType?.trim() || !PROJECT_TYPES.includes(projectType)) {
      return NextResponse.json({ error: 'Selecciona un tipo de proyecto' }, { status: 400 });
    }

    const n = name.trim();
    const e = email.trim();
    const p = phone.trim();
    const c = company.trim();
    const formattedMessage = [
      `Nombre: ${n}`,
      `Email: ${e}`,
      `Teléfono: ${p}`,
      `Empresa: ${c}`,
      `Tipo de proyecto: ${projectType}`,
      '',
      message.trim(),
    ].join('\n');

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: apiKey,
        subject: `Nuevo proyecto: ${n}`,
        from_name: n,
        email: e,
        name: n,
        phone: p,
        company: c,
        project_type: projectType,
        message: formattedMessage,
      }),
    });

    const text = await res.text();
    let data: { success?: boolean; message?: string };
    try {
      data = JSON.parse(text);
    } catch {
      console.error('contact: Web3Forms devolvió no-JSON', res.status, text.slice(0, 200));
      const msg = res.status === 403
        ? 'El servicio de envío no está disponible temporalmente (acceso bloqueado). Intenta más tarde.'
        : res.status === 429
          ? 'Demasiados envíos. Espera un momento e intenta de nuevo.'
          : 'Error al enviar el mensaje. Intenta más tarde.';
      return NextResponse.json({ error: msg }, { status: res.status === 429 ? 429 : 500 });
    }
    if (res.status === 429) {
      return NextResponse.json(
        { error: data.message || 'Demasiados envíos. Espera un momento e intenta de nuevo.' },
        { status: 429 }
      );
    }
    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Error al enviar' }, { status: 500 });
    }
    if (!data.success) {
      return NextResponse.json({ error: data.message || 'Error al enviar' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('contact', e);
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 });
  }
}
