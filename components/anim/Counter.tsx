"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/motion";

type CounterProps = { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number; grouping?: boolean };

const format = (n: number, decimals: number, grouping: boolean) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouping }).format(n);

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/** Counts up from zero the first time it scrolls into view. Renders the final number on the server. */
export function Counter({ value, decimals = 0, prefix = "", suffix = "", duration = 1600, grouping = true }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, "0px 0px -10% 0px");
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    let start = 0;
    let frame = requestAnimationFrame(function tick(now) {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      setShown(value * easeOutExpo(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {format(shown, decimals, grouping)}
      {suffix}
    </span>
  );
}
