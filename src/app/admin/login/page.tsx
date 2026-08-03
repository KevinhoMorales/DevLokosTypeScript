'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const { user, loading, isAdmin, adminChecked, login, logout } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && adminChecked && isAdmin) {
      router.replace('/admin');
    }
  }, [user, loading, isAdmin, adminChecked, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      // AuthContext refresca isAdmin; redirect lo hace el effect
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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-xl font-bold">Sin permisos de administrador</h1>
        <p className="text-zinc-400 text-sm text-center">
          {user.email} no está registrado en la colección admin.
        </p>
        <Button
          onClick={async () => {
            await logout();
          }}
          className="bg-primary"
        >
          Probar otra cuenta
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6 border border-white/10 rounded-2xl p-8 bg-[#0A0A0A]"
      >
        <div>
          <p className="text-primary font-semibold text-sm mb-1">DevLokos</p>
          <h1 className="text-2xl font-bold">Administración</h1>
          <p className="text-zinc-500 text-sm mt-1">Inicia sesión con tu cuenta admin</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Email</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border-white/10 h-12"
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Contraseña</label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border-white/10 h-12"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-12 bg-primary hover:bg-primary/90"
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
