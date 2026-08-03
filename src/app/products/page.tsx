import ProductsSection from '@/components/ProductsSection';
import { SECTION_PAGE_WRAPPER } from '@/lib/section-layout';

export const metadata = {
  title: 'Productos | DevLokos',
  description:
    'Libros y productos digitales de DevLokos. Dominando Kotlin, Swift y Dart y más recursos para desarrolladores.',
};

export default function ProductsPage() {
  return (
    <div className={SECTION_PAGE_WRAPPER}>
      <ProductsSection />
    </div>
  );
}
