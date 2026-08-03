'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { BookOpen, SearchX, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyticsEvents } from '@/lib/analytics';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/button';
import { SECTION_CONTAINER } from '@/lib/section-layout';

type StoreLink = { label: string; url: string };

type Product = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  type?: string;
  storeLinks?: StoreLink[];
};

function typeLabel(type?: string): string {
  const v = (type || '').toLowerCase();
  if (v === 'book') return 'Libro';
  if (v === 'digital') return 'Digital';
  return 'Producto';
}

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const viewedRef = useRef(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detailLoggedRef = useRef<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProducts(data.products ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!loading && !viewedRef.current) {
      viewedRef.current = true;
      analyticsEvents.products_viewed();
    }
  }, [loading]);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    if (selected) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onEscape);
      if (detailLoggedRef.current !== selected.id) {
        detailLoggedRef.current = selected.id;
        analyticsEvents.product_viewed(selected.id, selected.title, selected.type);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEscape);
    };
  }, [selected]);

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return products;
    return products.filter((p) => {
      return (
        normalize(p.title).includes(q) ||
        normalize(p.description || '').includes(q) ||
        normalize(typeLabel(p.type)).includes(q) ||
        normalize(p.type || '').includes(q)
      );
    });
  }, [products, search]);

  useEffect(() => {
    if (!search.trim()) return;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      analyticsEvents.search_performed(search, 'products', filtered.length);
      searchDebounceRef.current = null;
    }, 500);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search, filtered.length]);

  const openStore = (product: Product, link: StoreLink) => {
    const ok = window.confirm(`¿Quieres abrir ${link.label} para comprar este producto?`);
    if (!ok) return;
    analyticsEvents.product_store_clicked(product.id, link.label);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const hasQuery = search.trim().length > 0;

  return (
    <section className={SECTION_CONTAINER}>
      <SectionIntro>
        Libros y productos digitales de DevLokos para impulsar tu carrera. Empieza con Dominando
        Kotlin, Swift y Dart — el catálogo irá creciendo.
      </SectionIntro>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar productos..."
        className="mb-6 max-w-2xl"
      />

      <SectionHeader title="Productos" align="start" className="mb-6" />

      {loading && <LoadingSkeleton count={2} variant="card" />}

      {error && (
        <ErrorState title="No pudimos cargar los productos" message={error} onRetry={load} />
      )}

      {!loading && !error && products.length === 0 && (
        <EmptyState
          title="Pronto habrá productos"
          subtitle="Estamos preparando el catálogo. Vuelve en breve."
        />
      )}

      {!loading && !error && products.length > 0 && filtered.length === 0 && (
        <EmptyState
          icon={<SearchX className="h-14 w-14" />}
          title="No se encontraron productos"
          subtitle={hasQuery ? `Búsqueda: "${search.trim()}"` : 'Prueba con otro término.'}
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
          {filtered.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelected(product)}
              className="group text-left rounded-2xl overflow-hidden border border-primary/20 bg-card-bg hover:border-primary/45 transition-colors shadow-[0_12px_40px_rgba(255,145,77,0.05)]"
            >
              <div className="relative h-40 bg-zinc-900">
                {product.thumbnailUrl ? (
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-3 bottom-3 text-xs px-2.5 py-1 rounded-full bg-black/70 text-primary border border-primary/40 font-semibold">
                  {typeLabel(product.type)}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-white text-lg font-bold leading-snug line-clamp-2">
                  {product.title}
                </h3>
                {product.description && (
                  <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                )}
                <p className="text-primary text-sm font-semibold pt-1">Ver detalle</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card-bg rounded-2xl border border-primary/25 shadow-[0_12px_40px_rgba(255,145,77,0.08)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              aria-hidden
              className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-transparent"
            />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-primary/20 text-white flex items-center justify-center transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-48 sm:h-56 bg-zinc-900 overflow-hidden">
              {selected.thumbnailUrl ? (
                <Image
                  src={selected.thumbnailUrl}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 672px) 100vw, 672px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                  <BookOpen className="w-16 h-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent opacity-90" />
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <span className="inline-flex text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/35 font-semibold">
                {typeLabel(selected.type)}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white pr-10 leading-tight">
                {selected.title}
              </h2>
              {selected.description && (
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {selected.description}
                </p>
              )}

              {selected.storeLinks && selected.storeLinks.length > 0 && (
                <div className="pt-2 space-y-3">
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide">
                    Disponible en
                  </p>
                  <div className="flex flex-col gap-2">
                    {selected.storeLinks.map((link) => (
                      <Button
                        key={`${selected.id}-${link.label}`}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={() => openStore(selected, link)}
                      >
                        Comprar en {link.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
