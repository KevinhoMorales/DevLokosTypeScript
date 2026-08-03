'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { BookOpen, ExternalLink } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { SectionHeader } from '@/components/ui/SectionHeader';
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

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewedRef = useRef(false);

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

  return (
    <section className={SECTION_CONTAINER}>
      <SectionIntro>
        Libros y productos digitales de DevLokos para impulsar tu carrera. Empieza con Dominando
        Kotlin, Swift y Dart — el catálogo irá creciendo.
      </SectionIntro>

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

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-2xl overflow-hidden border border-primary/15 bg-[#0D0D0D] hover:border-primary/40 transition-colors"
            >
              <div className="relative aspect-[4/3] bg-zinc-900">
                {product.thumbnailUrl ? (
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                    <BookOpen className="w-16 h-16" />
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                  {typeLabel(product.type)}
                </span>
                <h3 className="text-white text-xl font-bold">{product.title}</h3>
                {product.description && (
                  <p className="text-zinc-400 text-sm leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                )}
                {product.storeLinks && product.storeLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.storeLinks.map((link) => (
                      <Button
                        key={`${product.id}-${link.label}`}
                        asChild
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            analyticsEvents.product_store_clicked(product.id, link.label)
                          }
                        >
                          {link.label}
                          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
