"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** curtain: wiped up from the bottom. rise: fades up. draw: SVG strokes inside draw themselves. mark: .mark highlights sweep in. */
  variant?: "curtain" | "rise" | "draw" | "mark";
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Plays its entrance the first time it scrolls into view. Content is only hidden once JavaScript
 * has loaded, and never if it is already on screen by then, so nothing visible blinks away.
 */
export function Reveal({ children, variant = "rise", delay = 0, as: Tag = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    el.dataset.armed = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-seen");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} data-reveal={variant} className={className} style={{ "--d": `${delay}s` } as CSSProperties}>
      {children}
    </Tag>
  );
}
