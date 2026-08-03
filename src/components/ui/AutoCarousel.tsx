'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from 'react';

interface AutoCarouselProps {
  children: ReactNode[];
  /** Auto-advance interval in ms */
  intervalMs?: number;
  className?: string;
  itemClassName?: string;
  /** Accessible label for the carousel region */
  label?: string;
}

const RESUME_DELAY_MS = 2000;

/**
 * Horizontal snap carousel with autoplay (~5s), pause on focus/drag, and dots.
 * Resumes ~2s after pointer/touch interaction ends.
 */
export function AutoCarousel({
  children,
  intervalMs = 5000,
  className = '',
  itemClassName = 'min-w-[280px] max-w-[300px] snap-start shrink-0',
  label = 'Carrusel',
}: AutoCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const draggingRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);
  const count = children.length;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pauseForInteraction = useCallback(() => {
    clearResumeTimer();
    draggingRef.current = true;
    setPaused(true);
  }, [clearResumeTimer]);

  const scheduleResume = useCallback(() => {
    draggingRef.current = false;
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null;
      setPaused(false);
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer]);

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const el = scrollerRef.current;
      if (!el || count === 0) return;
      const i = ((index % count) + count) % count;
      const child = el.children[i] as HTMLElement | undefined;
      if (!child) return;
      const scrollBehavior =
        reducedMotion || behavior === 'auto' ? 'auto' : behavior;
      el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: scrollBehavior });
      setActive(i);
    },
    [count, reducedMotion],
  );

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || count === 0) return;
    const scrollLeft = el.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      const dist = Math.abs(child.offsetLeft - el.offsetLeft - scrollLeft);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    setActive(best);
  }, [count]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      window.requestAnimationFrame(updateActiveFromScroll);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [updateActiveFromScroll]);

  useEffect(() => {
    if (paused || reducedMotion || count <= 1) return;
    const id = window.setInterval(() => {
      if (draggingRef.current) return;
      scrollToIndex(activeRef.current + 1);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, count, intervalMs, scrollToIndex]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(active - 1);
    }
  };

  if (count === 0) return null;

  return (
    <div
      className={`space-y-4 ${className}`}
      onFocusCapture={() => {
        clearResumeTimer();
        setPaused(true);
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        ref={scrollerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={pauseForInteraction}
        onPointerUp={scheduleResume}
        onPointerCancel={scheduleResume}
        onTouchStart={pauseForInteraction}
        onTouchEnd={scheduleResume}
        onTouchCancel={scheduleResume}
        className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={itemClassName}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${count}`}
            aria-hidden={index !== active}
          >
            {child}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div
          className="flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Indicadores del carrusel"
        >
          {children.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Ir a diapositiva ${index + 1}`}
              onClick={() => scrollToIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === active
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Diapositiva {active + 1} de {count}
      </p>
    </div>
  );
}
