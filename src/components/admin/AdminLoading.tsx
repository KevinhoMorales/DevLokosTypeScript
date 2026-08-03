'use client';

export function AppLoading({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <div className="h-9 w-9 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  );
}
