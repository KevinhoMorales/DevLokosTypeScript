import { NextRequest, NextResponse } from 'next/server';

const PROJECT_TYPES = [
  'Desarrollo de software a medida',
  'Consultoría',
  'Desarrollo de aplicaciones móviles',
  'Desarrollo web',
  'DevOps e infraestructura',
  'Otro',
];

export async function POST(request: NextRequest) {
  const apiKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Formulario no configurado' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, company, projectType, message } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Nombre, email y mensaje son obligatorios' }, { status: 400 });
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: apiKey,
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || '',
        company: company?.trim() || '',
        project_type: projectType && PROJECT_TYPES.includes(projectType) ? projectType : 'Otro',
        message: message.trim(),
      }),
    });

    const data = await res.json();
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
