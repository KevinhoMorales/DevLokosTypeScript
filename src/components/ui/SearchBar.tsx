'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...', className = '' }: SearchBarProps) {
  return (
    <div className={`relative max-w-xl mx-auto ${className}`}>
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0D0D0D] border-white/10 text-white placeholder:text-zinc-500 h-12 pl-5 pr-12 rounded-2xl focus-visible:ring-primary focus-visible:border-primary/50"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Borrar búsqueda"
        >
          <X className="h-5 w-5" />
        </button>
      ) : (
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 h-5 w-5 pointer-events-none" />
      )}
    </div>
  );
}
