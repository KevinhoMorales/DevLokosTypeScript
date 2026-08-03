'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react';

interface AutoCarouselProps {
  children: ReactNode[];
  /** Pixels per second for continuous auto-scroll */
  speedPxPerSec?: number;
  className?: string;
  itemClassName?: string;
  /** Accessible label for the carousel region */
  label?: string;
}

const RESUME_DELAY_MS = 2000;
const DEFAULT_SPEED = 28;

/**
 * Horizontal carousel with subtle continuous auto-scroll.
 * Pauses on focus/drag; resumes ~2s after interaction. No scrollbar or dots.
 */
export function AutoCarousel({
  children,
  speedPxPerSec = DEFAULT_SPEED,
  className = '',
  itemClassName = 'min-w-[280px] max-w-[300px] shrink-0',
  label = 'Carrusel',
}: AutoCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const draggingRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const count = children.length;

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reducedMotionRef.current = mq.matches;
    };
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
    pausedRef.current = true;
    lastTsRef.current = null;
  }, [clearResumeTimer]);

  const scheduleResume = useCallback(() => {
    draggingRef.current = false;
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null;
      pausedRef.current = false;
      lastTsRef.current = null;
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer]);

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer]);

  const nudgeBy = useCallback((delta: number) => {
    const el = scrollerRef.current;
    if (!el || count <= 1) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    let next = el.scrollLeft + delta;
    if (next >= max - 0.5) next = 0;
    if (next < 0) next = max;
    el.scrollLeft = next;
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      if (
        !pausedRef.current &&
        !draggingRef.current &&
        !reducedMotionRef.current
      ) {
        nudgeBy(speedPxPerSec * dt);
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTsRef.current = null;
    };
  }, [count, speedPxPerSec, nudgeBy]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nudgeBy(80);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nudgeBy(-80);
    }
  };

  if (count === 0) return null;

  return (
    <div
      className={className}
      onFocusCapture={() => {
        clearResumeTimer();
        pausedRef.current = true;
        lastTsRef.current = null;
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          pausedRef.current = false;
          lastTsRef.current = null;
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
        className="discover-rail flex gap-4 overflow-x-auto pb-1 -mx-1 px-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={itemClassName}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${count}`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
