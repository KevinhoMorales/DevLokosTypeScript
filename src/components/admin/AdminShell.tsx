'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AppLoading } from '@/components/admin/AdminLoading';

const NAV = [
  { href: '/admin', label: 'Inicio', exact: true },
  { href: '/admin/courses', label: 'Cursos' },
  { href: '/admin/events', label: 'Eventos' },
  { href: '/admin/services', label: 'Servicios' },
  { href: '/admin/portfolio', label: 'Portafolio' },
  { href: '/admin/products', label: 'Productos' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, adminChecked, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (loading || isLogin) return;
    if (!user) {
      router.replace('/admin/login');
      return;
    }
    if (adminChecked && !isAdmin) {
      // stay and show forbidden in shell
    }
  }, [user, loading, isAdmin, adminChecked, isLogin, router]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (loading || !adminChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <AppLoading label="Verificando sesión..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">Sin permisos de administrador</h1>
        <p className="text-zinc-400 text-center max-w-md">
          Tu cuenta ({user.email}) no está en la lista de administradores de Firestore.
        </p>
        <Button
          onClick={async () => {
            await logout();
            router.replace('/admin/login');
          }}
          className="bg-primary hover:bg-primary/90"
        >
          Cerrar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <aside className="md:w-56 border-b md:border-b-0 md:border-r border-white/10 p-4 md:min-h-screen shrink-0">
        <Link href="/admin" className="block font-bold text-lg text-primary mb-6">
          DevLokos Admin
        </Link>
        <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-primary/20 text-primary'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 pt-4 border-t border-white/10 hidden md:block">
          <p className="text-xs text-zinc-500 truncate mb-2">{user.email}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-white/10 text-zinc-300"
            onClick={async () => {
              await logout();
              router.replace('/admin/login');
            }}
          >
            Cerrar sesión
          </Button>
          <Link
            href="/"
            className="block text-center text-xs text-zinc-500 mt-3 hover:text-primary"
          >
            Ver sitio público
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 max-w-5xl w-full">{children}</main>
    </div>
  );
}
