'use client';

import { usePathname } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <AnalyticsProvider>
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </AnalyticsProvider>
  );
}
