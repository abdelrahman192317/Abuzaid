"use client";

import { useEffect, useRef } from "react";

interface SectionShellProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** Full-viewport height (default). Set false for sections that pin/scrub. */
  fullHeight?: boolean;
  /** Image srcs to warm up as the user approaches this section. */
  preloadSrcs?: string[];
}

/**
 * Standard section wrapper: fills the viewport (100svh) so every section reads
 * as its own "page", applies consistent editorial padding, and warm-preloads
 * the section's heavier assets just before they scroll into view.
 */
export function SectionShell({
  id,
  className = "",
  children,
  fullHeight = true,
  preloadSrcs,
}: SectionShellProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!preloadSrcs?.length || !ref.current) return;
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (done) return;
        if (entries.some((e) => e.isIntersecting)) {
          done = true;
          preloadSrcs.forEach((src) => {
            const img = new Image();
            img.src = src;
          });
          io.disconnect();
        }
      },
      { rootMargin: "60% 0px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [preloadSrcs]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative w-full ${
        fullHeight ? "min-h-[100svh]" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}
