'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function AdminLoginPage() {
  const { user, loading, isAdmin, adminChecked, login, logout } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const firebaseReady = isFirebaseConfigured();

  const close = useCallback(() => {
    router.push('/');
  }, [router]);

  useEffect(() => {
    if (!loading && user && adminChecked && isAdmin) {
      router.replace('/admin');
    }
  }, [user, loading, isAdmin, adminChecked, router]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firebaseReady) {
      setError(
        'Firebase Auth no está configurado. Añade NEXT_PUBLIC_FIREBASE_API_KEY en .env.local (o en Vercel) y reinicia el servidor.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(
        msg.includes('auth/')
          ? 'Email o contraseña incorrectos'
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        Cargando...
      </div>
    );
  }

  if (user && adminChecked && !isAdmin) {
    return (
      <div
        className="min-h-screen bg-black/95 text-white flex items-center justify-center px-4"
        onClick={close}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-denied-title"
          className="relative w-full max-w-md space-y-5 border border-white/10 rounded-2xl p-8 bg-[#0A0A0A] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClose={close} />
          <div>
            <p className="text-primary font-semibold text-sm mb-1">DevLokos</p>
            <h1 id="admin-denied-title" className="text-2xl font-bold">
              Sin permisos de administrador
            </h1>
            <p className="text-zinc-400 text-sm mt-2">
              {user.email} no está registrado en la colección admin.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={async () => {
                await logout();
              }}
              className="w-full h-12 bg-primary hover:bg-primary/90"
            >
              Probar otra cuenta
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={close}
              className="w-full h-11 text-zinc-400 hover:text-white"
            >
              Volver al sitio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black/95 text-white flex items-center justify-center px-4"
      onClick={close}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md space-y-6 border border-white/10 rounded-2xl p-8 bg-[#0A0A0A] shadow-2xl"
      >
        <CloseButton onClose={close} />

        <div className="pr-10">
          <p className="text-primary font-semibold text-sm mb-1">DevLokos</p>
          <h1 id="admin-login-title" className="text-2xl font-bold">
            Administración
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Inicia sesión con tu cuenta admin
          </p>
        </div>

        {!firebaseReady && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-200/90">
            Falta configurar <code className="text-amber-100">NEXT_PUBLIC_FIREBASE_API_KEY</code>.
            El login de admin usa el SDK cliente de Firebase Auth, no el Admin SDK del servidor.
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="admin-email" className="text-sm text-zinc-400">
            Email
          </label>
          <Input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border-white/10 h-12"
            autoComplete="email"
            placeholder="admin@devlokos.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="admin-password" className="text-sm text-zinc-400">
            Contraseña
          </label>
          <Input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border-white/10 h-12"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 leading-relaxed" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting || !firebaseReady}
          className="w-full h-12 bg-primary hover:bg-primary/90"
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
      aria-label="Cerrar"
    >
      <X className="w-5 h-5" />
    </button>
  );
}
