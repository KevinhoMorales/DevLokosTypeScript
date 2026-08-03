'use client';

import { useEffect, useMemo, useState, useRef, type Dispatch, type SetStateAction } from 'react';
import Image from 'next/image';
import { analyticsEvents } from '@/lib/analytics';
import { Search, Palette, Code, Rocket, Check, Briefcase, FolderOpen, Phone, Compass } from 'lucide-react';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SECTION_CONTAINER } from '@/lib/section-layout';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

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
  { icon: Search, num: '01', label: 'Descubrimiento' },
  { icon: Palette, num: '02', label: 'Diseño' },
  { icon: Code, num: '03', label: 'Desarrollo' },
  { icon: Rocket, num: '04', label: 'Entrega' },
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
  category?: string;
  projectUrl?: string;
}

const PORTFOLIO_FILTERS = ['Todos', 'iOS', 'Android', 'Web', 'Flutter'] as const;

const FALLBACK_SERVICES: Service[] = [
  {
    id: 'fallback-software',
    title: 'Software a medida',
    description:
      'Productos y plataformas pensadas para tu operación, no plantillas genéricas.',
    icon: 'code',
    features: ['Descubrimiento y arquitectura', 'Desarrollo de punta a punta', 'Entrega continua'],
  },
  {
    id: 'fallback-mobile',
    title: 'Apps móviles',
    description:
      'iOS y Android con foco en rendimiento, UX y mantenimiento a largo plazo.',
    icon: 'phone',
    features: ['Flutter con sensación nativa', 'Integraciones de backend', 'Publicación en tiendas'],
  },
  {
    id: 'fallback-consulting',
    title: 'Consultoría técnica',
    description:
      'Acompañamos a tu equipo en decisiones de stack, cloud y procesos.',
    icon: 'explore',
    features: ['Auditoría técnica', 'Hoja de ruta del producto', 'Mentoría a equipos'],
  },
];

function serviceIcon(icon?: string): LucideIcon {
  const key = (icon || '').toLowerCase();
  if (key.includes('phone') || key.includes('mobile')) return Phone;
  if (key.includes('explore') || key.includes('consult')) return Compass;
  if (key.includes('code') || key.includes('software')) return Code;
  return Briefcase;
}

export default function EnterpriseSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioFilter, setPortfolioFilter] = useState<(typeof PORTFOLIO_FILTERS)[number]>('Todos');
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
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

  const enterpriseViewedRef = useRef(false);
  useEffect(() => {
    if (!loading && !enterpriseViewedRef.current) {
      enterpriseViewedRef.current = true;
      analyticsEvents.enterprise_viewed();
    }
  }, [loading]);

  const contactStartedRef = useRef(false);
  const handleContactFocus = () => {
    if (!contactStartedRef.current) {
      contactStartedRef.current = true;
      analyticsEvents.enterprise_contact_started();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    const n = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const company = form.company.trim();
    const projectType = form.projectType?.trim() || '';
    const message = form.message.trim();

    if (!n || !email || !phone || !company || !projectType || !message) {
      setFormError('Completa todos los campos.');
      setFormLoading(false);
      return;
    }
    if (!PROJECT_TYPES.includes(projectType)) {
      setFormError('Selecciona un tipo de proyecto válido.');
      setFormLoading(false);
      return;
    }

    const formattedMessage = [
      `Nombre: ${n}`,
      `Email: ${email}`,
      `Teléfono: ${phone}`,
      `Empresa: ${company}`,
      `Tipo de proyecto: ${projectType}`,
      '',
      message,
    ].join('\n');

    const web3Payload = {
      access_key: '',
      subject: `Nuevo proyecto: ${n}`,
      from_name: n,
      email,
      name: n,
      phone,
      company,
      project_type: projectType,
      message: formattedMessage,
    };

    const doClientSubmit = (accessKey: string) => {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...web3Payload, access_key: accessKey }),
      })
        .then(async (r) => {
          const text = await r.text();
          let data: { success?: boolean; message?: string };
          try {
            data = JSON.parse(text);
          } catch {
            setFormError(r.status === 403 ? 'El envío fue bloqueado. Intenta más tarde.' : 'Error al enviar. Intenta más tarde.');
            return;
          }
          if (!data.success) throw new Error(data.message || 'Error al enviar');
          analyticsEvents.enterprise_contact_submitted(true);
          setFormSent(true);
          setForm({ name: '', email: '', phone: '', company: '', projectType: '', message: '' });
        })
        .catch((err) => setFormError(err instanceof Error ? err.message : 'Error al enviar'))
        .finally(() => setFormLoading(false));
    };

    const clientKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
    if (clientKey) {
      doClientSubmit(clientKey);
      return;
    }

    fetch('/api/contact/config')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('No config'))))
      .then((data: { accessKey?: string }) => {
        if (data?.accessKey?.trim()) {
          doClientSubmit(data.accessKey.trim());
        } else {
          throw new Error('No config');
        }
      })
      .catch(() => {
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
        if (data?.error) throw new Error(data.error);
        analyticsEvents.enterprise_contact_submitted(true);
        setFormSent(true);
        setForm({ name: '', email: '', phone: '', company: '', projectType: '', message: '' });
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : 'Error al enviar';
        if (msg === 'Formulario no configurado') {
          const base = 'En este momento no podemos recibir mensajes por este formulario. Por favor intenta más tarde o contacta por otro medio.';
          const devHint = typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? ' Configura web_3_form en Firebase Remote Config o WEB3FORMS_ACCESS_KEY en .env.local y reinicia.'
            : '';
          setFormError(base + devHint);
        } else {
          setFormError(msg);
        }
      })
      .finally(() => setFormLoading(false));
      });
  };

  const displayServices = services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <section id="enterprise-section" className={`${SECTION_CONTAINER} bg-black space-y-10`}>
      <SectionIntro>
        Software a medida y consultoría para empresas. Proceso claro, servicios concretos y contacto cuando estés listo.
      </SectionIntro>

      <div>
        <SectionHeader title="Nuestro proceso" align="start" className="mb-4" />
        <div className="grid grid-cols-2 gap-2.5 max-w-3xl">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-[#0D0D0D] border border-primary/15 p-3.5 text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <step.icon className="w-5 h-5 text-primary" />
                <span className="text-primary text-xs font-bold tracking-wide">{step.num}</span>
              </div>
              <p className="text-white font-semibold text-sm">{step.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {!loading && (
        <div>
          <SectionHeader title="Servicios" align="start" className="mb-4" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl">
            {displayServices.map((s) => {
              const Icon = serviceIcon(s.icon);
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-[#0D0D0D] border border-primary/15 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-semibold mb-1">{s.title}</h4>
                      {s.description && (
                        <p className="text-zinc-400 text-sm mb-3 line-clamp-3">{s.description}</p>
                      )}
                      {s.features && s.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {s.features.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-zinc-300 border border-primary/15 bg-black/30"
                            >
                              <Check className="w-3 h-3 text-primary shrink-0" />
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && portfolio.length > 0 && (
        <PortfolioGrid
          items={portfolio}
          filter={portfolioFilter}
          onFilterChange={setPortfolioFilter}
        />
      )}

      <div className="max-w-xl mx-auto rounded-2xl border border-primary/20 bg-[#0D0D0D] p-6 md:p-8 text-center">
        <h3 className="text-white text-xl font-bold mb-2">¿Listo para construir?</h3>
        <p className="text-zinc-400 text-sm mb-5">
          Cuéntanos tu proyecto y te respondemos en menos de 24 h.
        </p>
        {!showForm && !formSent && (
          <Button
            type="button"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={() => {
              setShowForm(true);
              handleContactFocus();
            }}
          >
            Inicia un proyecto
          </Button>
        )}

        {formSent && (
          <div className="py-4 rounded-xl bg-primary/10 border border-primary/30">
            <p className="text-primary font-medium">Mensaje enviado correctamente.</p>
            <p className="text-zinc-400 text-sm mt-1">Te responderemos pronto.</p>
          </div>
        )}

        {showForm && !formSent && (
          <form onSubmit={handleSubmit} className="space-y-4 text-left mt-2">
            <div>
              <Input
                required
                id="contact-name"
                value={form.name}
                onFocus={handleContactFocus}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nombre *"
                className="bg-black/40 border-primary/20 text-white placeholder:text-zinc-500 h-11"
              />
            </div>
            <div>
              <Input
                required
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Email *"
                className={`bg-black/40 text-white placeholder:text-zinc-500 h-11 ${emailError ? 'border-red-500 focus-visible:ring-red-500/50 focus-visible:border-red-500' : 'border-primary/20'}`}
                aria-invalid={!!emailError}
              />
              {emailError ? (
                <p className="text-red-400 text-xs mt-1.5">{emailError}</p>
              ) : null}
            </div>
            <div>
              <Input
                required
                id="contact-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="Teléfono *"
                className="bg-black/40 border-primary/20 text-white placeholder:text-zinc-500 h-11"
              />
            </div>
            <div>
              <Input
                required
                id="contact-company"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="Empresa *"
                className="bg-black/40 border-primary/20 text-white placeholder:text-zinc-500 h-11"
              />
            </div>
            <div>
              <select
                required
                id="contact-project-type"
                value={form.projectType}
                onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                className="w-full h-11 px-3 rounded-md border border-primary/20 bg-black/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Tipo de proyecto *</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <textarea
                required
                id="contact-message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Mensaje *"
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-primary/20 bg-black/40 text-white placeholder:text-zinc-500 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {formError && <p className="text-red-400 text-sm">{formError}</p>}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                className="sm:flex-1 border-primary/20 text-zinc-300"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={formLoading || !canSubmit}
                className="sm:flex-1 bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
              >
                {formLoading ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function PortfolioGrid({
  items,
  filter,
  onFilterChange,
}: {
  items: PortfolioItem[];
  filter: (typeof PORTFOLIO_FILTERS)[number];
  onFilterChange: Dispatch<SetStateAction<(typeof PORTFOLIO_FILTERS)[number]>>;
}) {
  const filtered = useMemo(() => {
    if (filter === 'Todos') return items;
    return items.filter(
      (p) => (p.category || '').toLowerCase() === filter.toLowerCase()
    );
  }, [items, filter]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <SectionHeader title="Portafolio" align="start" className="mb-1" />
          <p className="text-zinc-500 text-sm">
            {items.length} proyectos entregados — apps, web y productos reales.
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none">
        {PORTFOLIO_FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => onFilterChange(f)}>
            {f}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm py-8">No hay proyectos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {filtered.map((p) => {
            const cardClassName =
              'group rounded-2xl overflow-hidden bg-card-bg border border-primary/15 hover:border-primary/45 transition-colors text-left block shadow-[0_12px_40px_rgba(255,145,77,0.04)]';
            const inner = (
              <>
                <div className="relative aspect-[5/4] bg-zinc-900 overflow-hidden">
                  {p.thumbnailUrl ? (
                    <Image
                      src={p.thumbnailUrl}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-zinc-900 to-black text-zinc-600">
                      <FolderOpen className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  {p.category && (
                    <span className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-white text-black">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-white font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {p.title}
                  </h4>
                  {p.description && (
                    <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  )}
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[11px] text-zinc-400"
                        >
                          {t}
                        </span>
                      ))}
                      {p.technologies.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] text-zinc-500">
                          +{p.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-primary text-sm font-semibold pt-1">Ver proyecto</p>
                </div>
              </>
            );

            if (p.projectUrl) {
              return (
                <a
                  key={p.id}
                  href={p.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {inner}
                </a>
              );
            }

            return (
              <div key={p.id} className={cardClassName}>
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
