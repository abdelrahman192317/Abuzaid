"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VideoTile } from "@/components/ui/VideoTile";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { MediaItem } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface FeaturedProjectProps {
  title: string;
  subtitle: string;
  clips: MediaItem[];
}

/**
 * Grow-to-fill spotlight: a small multi-clip frame scales up with scroll until
 * it fills the screen, signalling a flagship project. Reduced motion → static.
 */
export function FeaturedProject({ title, subtitle, clips }: FeaturedProjectProps) {
  const reduced = usePrefersReducedMotion();

  const scope = useGsapContext<HTMLElement>(
    () => {
      if (reduced) {
        gsap.set(".feat-frame", { scale: 1, borderRadius: 0 });
        return;
      }
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".feat-pin",
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 0.6,
          },
        })
        .fromTo(
          ".feat-frame",
          { scale: 0.34, borderRadius: 24 },
          { scale: 1, borderRadius: 0, ease: "none" }
        )
        .fromTo(".feat-meta", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, "<0.4");
    },
    [reduced, clips.length]
  );

  return (
    <section id="featured" ref={scope as React.RefObject<HTMLElement>} className="bg-[var(--paper)]">
      <div className="feat-pin relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
        <div className="feat-frame relative h-[100svh] w-full origin-center overflow-hidden">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px]">
            {clips.slice(0, 4).map((c) => (
              <VideoTile key={c.src} media={c} className="h-full w-full" />
            ))}
          </div>

          <div className="feat-meta pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-[var(--paper)] mix-blend-difference">
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Featured</span>
            <h2 className="display mt-3 text-[clamp(2rem,7vw,6rem)]">{title}</h2>
            <p className="mt-2 max-w-[36ch] text-sm opacity-80">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
