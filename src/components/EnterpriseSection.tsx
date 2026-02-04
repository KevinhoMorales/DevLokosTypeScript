'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, Palette, Code, Rocket, Check, Briefcase, FolderOpen } from 'lucide-react';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SECTION_CONTAINER } from '@/lib/section-layout';
import { motion } from 'framer-motion';

const PROJECT_TYPES = [
  'Desarrollo de software a medida',
  'Consultoría',
  'Desarrollo de aplicaciones móviles',
  'Desarrollo web',
  'DevOps e infraestructura',
  'Otro',
];

/** Email: algo@dominio.algo */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEmailError(value: string): string | null {
  if (!value.trim()) return null;
  return EMAIL_REGEX.test(value.trim()) ? null : 'Escribe un correo válido (ej: nombre@dominio.com)';
}

const PROCESS_STEPS = [
  { icon: Search, label: 'Descubrimiento' },
  { icon: Palette, label: 'Diseño' },
  { icon: Code, label: 'Desarrollo' },
  { icon: Rocket, label: 'Entrega' },
];

interface Service {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  features?: string[];
}

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  technologies?: string[];
}

export default function EnterpriseSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    message: '',
  });

  const emailError = getEmailError(form.email);
  const canSubmit = !emailError;

  useEffect(() => {
    Promise.all([fetch('/api/services').then((r) => r.json()), fetch('/api/portfolio').then((r) => r.json())])
      .then(([svc, port]) => {
        setServices(svc.services ?? []);
        setPortfolio(port.portfolio ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        projectType: form.projectType || undefined,
        message: form.message,
      }),
    })
      .then(async (r) => {
        const text = await r.text();
        let data: { error?: string; success?: boolean };
        try {
          data = JSON.parse(text);
        } catch {
          return { error: 'Error al enviar el mensaje. Intenta más tarde.' };
        }
        if (!r.ok && data.error) return { error: data.error };
        if (data.error) return { error: data.error };
        return data;
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setFormSent(true);
        setForm({ name: '', email: '', phone: '', company: '', projectType: '', message: '' });
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : 'Error al enviar';
        if (msg === 'Formulario no configurado') {
          const base = 'En este momento no podemos recibir mensajes por este formulario. Por favor intenta más tarde o contacta por otro medio.';
          const devHint = typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? ' Para activarlo: configura web_3_form en Firebase Remote Config o WEB3FORMS_ACCESS_KEY en .env.local y reinicia el servidor.'
            : '';
          setFormError(base + devHint);
        } else {
          setFormError(msg);
        }
      })
      .finally(() => setFormLoading(false));
  };

  return (
    <section id="enterprise-section" className={`${SECTION_CONTAINER} bg-black`}>
      <SectionIntro>
        Servicios de desarrollo a medida y consultoría tecnológica. Cuéntanos tu idea y te respondemos con una propuesta.
      </SectionIntro>
      {/* Nuestro proceso - Grid 2x2 */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Nuestro proceso</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center p-6 rounded-2xl bg-[#0D0D0D] border border-white/10 hover:border-primary/50 transition-colors"
              >
                <step.icon className="w-10 h-10 text-primary mb-3" />
                <span className="text-white font-medium">{step.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Formulario Inicia un proyecto */}
        <div className="max-w-xl mx-auto mb-16">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Inicia un proyecto</h3>
          {formSent ? (
            <div className="text-center py-8 rounded-2xl bg-green-500/10 border border-green-500/30">
              <p className="text-green-400 font-medium">Mensaje enviado correctamente.</p>
              <p className="text-zinc-400 text-sm mt-1">Te responderemos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  required
                  id="contact-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nombre *"
                  className="bg-[#0D0D0D] border-white/10 text-white placeholder:text-zinc-500 h-11"
                />
                <p className="text-zinc-500 text-xs mt-1.5">Tu nombre o el de la persona de contacto.</p>
              </div>
              <div>
                <Input
                  required
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Email *"
                  className={`bg-[#0D0D0D] text-white placeholder:text-zinc-500 h-11 ${emailError ? 'border-red-500 focus-visible:ring-red-500/50 focus-visible:border-red-500' : 'border-white/10'}`}
                  aria-invalid={!!emailError}
                />
                {emailError ? (
                  <p className="text-red-400 text-xs mt-1.5">{emailError}</p>
                ) : (
                  <p className="text-zinc-500 text-xs mt-1.5">Usaremos este correo para responderte.</p>
                )}
              </div>
              <div>
                <Input
                  required
                  id="contact-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="Teléfono *"
                  className="bg-[#0D0D0D] border-white/10 text-white placeholder:text-zinc-500 h-11"
                />
                <p className="text-zinc-500 text-xs mt-1.5">Incluye código de país, ej: +593939598029</p>
              </div>
              <div>
                <Input
                  required
                  id="contact-company"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder="Empresa *"
                  className="bg-[#0D0D0D] border-white/10 text-white placeholder:text-zinc-500 h-11"
                />
                <p className="text-zinc-500 text-xs mt-1.5">Nombre de tu empresa u organización.</p>
              </div>
              <div>
                <select
                  required
                  id="contact-project-type"
                  value={form.projectType}
                  onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                  className="w-full h-11 px-3 rounded-md border border-white/10 bg-[#0D0D0D] text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-[color,box-shadow]"
                >
                  <option value="">Tipo de proyecto *</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <p className="text-zinc-500 text-xs mt-1.5">Selecciona la opción que más se acerque a tu necesidad.</p>
              </div>
              <div>
                <textarea
                  required
                  id="contact-message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Mensaje *"
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-white/10 bg-[#0D0D0D] text-white placeholder:text-zinc-500 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-[color,box-shadow]"
                />
                <p className="text-zinc-500 text-xs mt-1.5">Describe brevemente tu proyecto o consulta.</p>
              </div>
              {formError && <p className="text-red-400 text-sm">{formError}</p>}
              <Button type="submit" disabled={formLoading || !canSubmit} className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:pointer-events-none">
                {formLoading ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </form>
          )}
        </div>

        {/* Nuestros servicios */}
        {!loading && services.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Nuestros servicios</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="p-6 rounded-2xl bg-[#0D0D0D] border border-white/10 hover:border-primary/50 transition-colors"
                >
                  <div className="mb-2">
                    <Briefcase className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{s.title}</h4>
                  {s.description && <p className="text-zinc-400 text-sm mb-4">{s.description}</p>}
                  {s.features && s.features.length > 0 && (
                    <ul className="space-y-1">
                      {s.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proyectos destacados - carousel/grid */}
        {!loading && portfolio.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Proyectos destacados</h3>
            <div className="overflow-x-auto flex gap-4 pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
              {portfolio.map((p) => (
                <div
                  key={p.id}
                  className="flex-shrink-0 w-[280px] md:w-full snap-center rounded-2xl overflow-hidden bg-[#0D0D0D] border border-white/10 hover:border-primary/50 transition-colors"
                >
                  <div className="relative aspect-video bg-zinc-900">
                    {p.thumbnailUrl ? (
                      <Image
                        src={p.thumbnailUrl}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="280px"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                      <FolderOpen className="w-16 h-16" />
                    </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-1">{p.title}</h4>
                    {p.description && <p className="text-zinc-400 text-sm line-clamp-2">{p.description}</p>}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.technologies.slice(0, 4).map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-white/5 rounded text-xs text-zinc-500">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </section>
  );
}
