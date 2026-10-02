import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  value: number;
  label: string;
  suffix?: string;
  durationMs?: number;
}

export function AnimatedCounter({ value, label, suffix = '', durationMs = 1200 }: CounterProps) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reduceMotion.current) {
      setDisplay(value);
      return;
    }
    startTime.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const animate = (ts: number) => {
      if (startTime.current === null) startTime.current = ts;
      const elapsed = ts - startTime.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, durationMs]);

  return (
    <div className="text-center">
      <div className="font-display text-4xl md:text-5xl text-cream">
        {display.toLocaleString()}
        <span className="text-2xl md:text-3xl text-sage">{suffix}</span>
      </div>
      <div className="text-sm text-cream/70 mt-1">{label}</div>
    </div>
  );
}
