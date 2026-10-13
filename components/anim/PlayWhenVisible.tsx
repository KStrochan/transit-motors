"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Milliseconds to wait after the page becomes interactive before playing, for things in the first screen. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Keeps looping animations inside paused until they are on screen, so they never compete with the
 * first paint and stop using the CPU once scrolled away. CSS pauses anything under
 * data-playing="false"; SMIL animations in SVGs are paused and resumed here too.
 */
export function PlayWhenVisible({ children, delay = 0, as: Tag = "div", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const svgs = () => Array.from(el.querySelectorAll("svg"));
    let ready = delay === 0;
    let visible = false;
    const apply = () => {
      const play = ready && visible;
      el.dataset.playing = String(play);
      for (const svg of svgs()) {
        if (play) svg.unpauseAnimations();
        else svg.pauseAnimations();
      }
    };
    const timer = ready ? 0 : window.setTimeout(() => {
      ready = true;
      apply();
    }, delay);
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      apply();
    });
    observer.observe(el);
    apply();
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <Tag ref={ref as never} data-playing="false" className={className}>
      {children}
    </Tag>
  );
}
