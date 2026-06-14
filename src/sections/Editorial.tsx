"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaImage } from "@/components/ui/MediaImage";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { MediaItem } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Deliberate, sparse placement (top/left/width in %), lots of breathing room.
const SPOTS = [
  { top: 8, left: 6, w: 20, depth: 60 },
  { top: 30, left: 70, w: 16, depth: -80 },
  { top: 52, left: 30, w: 22, depth: 40 },
  { top: 14, left: 46, w: 14, depth: -50 },
  { top: 66, left: 8, w: 15, depth: 90 },
];

/**
 * Editorial / Moments — a handful of images scattered across an otherwise empty
 * field for an editorial, breathing layout. Subtle parallax on scroll; reduced
 * motion keeps it still. Mobile falls back to a clean stacked column.
 */
export function Editorial({ images }: { images: MediaItem[] }) {
  const reduced = usePrefersReducedMotion();
  const items = images.slice(0, 5);

  const scope = useGsapContext<HTMLElement>(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>(".moment").forEach((el) => {
        const depth = Number(el.dataset.depth || 0);
        gsap.fromTo(
          el,
          { y: depth },
          {
            y: -depth,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    [reduced, items.length]
  );

  return (
    <section
      id="editorial"
      ref={scope as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden px-[var(--gutter)] py-[14vh]"
    >
      <div className="mb-[8vh] flex items-baseline justify-between">
        <h2 className="display text-[clamp(2rem,6vw,5rem)]">Moments</h2>
        <span className="max-w-[26ch] text-right text-sm text-[var(--ink-60)]">
          Fragments between the work — kept loose on purpose.
        </span>
      </div>

      {/* desktop scatter */}
      <div className="relative hidden h-[120vh] md:block">
        {items.map((m, i) => {
          const s = SPOTS[i];
          return (
            <div
              key={m.src}
              data-depth={s.depth}
              className="moment absolute"
              style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.w}%` }}
            >
              <div className="relative w-full" style={{ aspectRatio: `${m.width}/${m.height}` }}>
                <MediaImage media={m} fill sizes="22vw" className="object-cover" />
              </div>
              <span className="mt-2 block font-mono text-[10px] text-[var(--ink-60)]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>

      {/* mobile column */}
      <div className="flex flex-col gap-12 md:hidden">
        {items.map((m, i) => (
          <div key={m.src} className={i % 2 ? "self-end w-2/3" : "w-3/4"}>
            <div className="relative w-full" style={{ aspectRatio: `${m.width}/${m.height}` }}>
              <MediaImage media={m} fill sizes="75vw" className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
