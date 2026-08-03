'use client';

interface LoadingSkeletonProps {
  count?: number;
  variant?: 'card' | 'video' | 'event';
  className?: string;
}

export function LoadingSkeleton({
  count = 6,
  variant = 'card',
  className = '',
}: LoadingSkeletonProps) {
  if (variant === 'video') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 animate-pulse"
          >
            <div className="w-full aspect-video bg-primary/20" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'event') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 animate-pulse"
          >
            <div className="w-full h-28 bg-primary/20" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-2/3" />
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 animate-pulse"
        >
          <div className="h-48 bg-primary/20" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-zinc-800 rounded w-32" />
            <div className="h-6 bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-800 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
