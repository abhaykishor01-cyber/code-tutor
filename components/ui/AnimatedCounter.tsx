"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates from 0 up to `value` once, whenever `value` changes (e.g. once it loads
 * from storage). It never re-triggers on its own and never increments further —
 * the underlying value is fixed by the caller (localStorage-backed), this component
 * only provides the visual count-up.
 */
export default function AnimatedCounter({
  value,
  durationMs = 1400,
}: {
  value: number;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(0);
  const frame = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    }

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, durationMs]);

  return <>{display.toLocaleString()}</>;
}
