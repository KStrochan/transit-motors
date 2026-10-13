"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useScrollProgress } from "@/lib/motion";

/** Writes how far it has scrolled through the viewport (0 to 1) to --progress, for CSS to draw with. */
export function ScrollProgress({ children, className = "", as: Tag = "div", start, end }: { children: ReactNode; className?: string; as?: ElementType; start?: number; end?: number }) {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, start, end);
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
