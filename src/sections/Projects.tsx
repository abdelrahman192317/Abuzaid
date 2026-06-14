"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaImage } from "@/components/ui/MediaImage";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useCursor } from "@/components/providers/CursorProvider";
import type { Project } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Center-focus scroll. The list scrolls vertically and the item nearest the
 * viewport centre grows/sharpens while neighbours shrink and dim — the primary
 * showcase of past work. Native vertical scroll, so touch behaves naturally.
 */
export function Projects({ projects }: { projects: Project[] }) {
  const reduced = usePrefersReducedMotion();
  const { setCursor } = useCursor();
  const rowsRef = useRef<HTMLDivElement>(null);

  const scope = useGsapContext<HTMLElement>(
    () => {
      if (reduced) return;
      const rows = gsap.utils.toArray<HTMLElement>(".proj-row");
      rows.forEach((row) => {
        const inner = row.querySelector<HTMLElement>(".proj-inner");
        if (!inner) return;
        ScrollTrigger.create({
          trigger: row,
          start: "top bottom",
          end: "bottom top",
          onUpdate: () => {
            const r = row.getBoundingClientRect();
            const center = r.top + r.height / 2;
            const dist = Math.abs(center - window.innerHeight / 2) / (window.innerHeight / 2);
            const k = gsap.utils.clamp(0, 1, dist);
            gsap.set(inner, {
              scale: 1 - 0.22 * k,
              opacity: 1 - 0.62 * k,
              filter: `blur(${(k * 3).toFixed(2)}px)`,
            });
          },
        });
      });
    },
    [reduced, projects.length]
  );

  return (
    <section
      id="projects"
      ref={scope as React.RefObject<HTMLElement>}
      className="relative w-full px-[var(--gutter)] py-[12vh]"
    >
      <div className="mb-[6vh] flex items-baseline justify-between">
        <h2 className="display text-[clamp(2rem,6vw,5rem)]">Projects</h2>
        <span className="font-mono text-xs text-[var(--ink-60)]">
          {String(projects.length).padStart(2, "0")} works
        </span>
      </div>

      <div ref={rowsRef} className="flex flex-col">
        {projects.map((p, i) => (
          <a
            key={p.id}
            href={`#projects`}
            className="proj-row group flex min-h-[55vh] items-center"
            onMouseEnter={() => setCursor("view")}
            onMouseLeave={() => setCursor("default")}
          >
            <div className="proj-inner flex w-full flex-col items-center gap-6 text-center will-change-transform md:flex-row md:items-center md:justify-between md:text-left">
              <div className="flex items-center gap-6">
                <span className="font-mono text-xs text-[var(--ink-60)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display text-[clamp(2.5rem,9vw,7rem)]">{p.title}</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden text-right text-sm text-[var(--ink-60)] md:block">
                  <div>{p.category}</div>
                  <div>{p.year}</div>
                </div>
                <div className="relative aspect-[4/5] w-[min(60vw,220px)] overflow-hidden bg-[var(--paper-2)]">
                  <MediaImage
                    media={p.cover}
                    fill
                    sizes="(max-width:768px) 60vw, 220px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
