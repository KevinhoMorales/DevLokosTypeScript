'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsEvents, getModuleForPath, setUserProperty } from '@/lib/analytics';

const FIRST_OPEN_KEY = 'devlokos_web_first_open';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isFirstOpen = !localStorage.getItem(FIRST_OPEN_KEY);
    if (isFirstOpen) {
      analyticsEvents.app_first_open();
      localStorage.setItem(FIRST_OPEN_KEY, 'true');
    }

    analyticsEvents.app_open();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return;

    const module = getModuleForPath(pathname);
    setUserProperty('preferred_module', module);

    const screenName = pathname === '/' ? 'home' : pathname.slice(1).replace(/\//g, '_') || 'home';
    analyticsEvents.screen_view(screenName, module);

    prevPathRef.current = pathname;
  }, [pathname]);

  return <>{children}</>;
}
