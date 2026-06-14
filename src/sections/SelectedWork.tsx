"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaImage } from "@/components/ui/MediaImage";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { MediaItem } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const RADIUS = 520;

/**
 * 3D depth loop — images arrive from the depth/centre and revolve around a ring
 * that travels toward the viewer and exits the top: an immersive entrance to
 * the gallery. Reduced motion → a simple staggered fade-in grid.
 */
export function SelectedWork({ images }: { images: MediaItem[] }) {
  const reduced = usePrefersReducedMotion();
  const step = 360 / images.length;

  const scope = useGsapContext<HTMLDivElement>(
    () => {
      if (reduced) {
        gsap.from(".sw-card", {
          autoAlpha: 0,
          y: 40,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: ".sw-stage", start: "top 75%" },
        });
        return;
      }
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".sw-pin",
            start: "top top",
            end: "+=240%",
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
            refreshPriority: 5,
          },
        })
        .fromTo(
          ".sw-ring",
          { rotateY: -130, z: -1200, autoAlpha: 0 },
          { rotateY: 150, z: 320, autoAlpha: 1, ease: "none", duration: 1 }
        )
        .to(".sw-ring", { y: "-45vh", autoAlpha: 0, ease: "power2.in", duration: 0.25 });
    },
    [reduced, images.length]
  );

  if (reduced) {
    return (
      <section id="selected" ref={scope} className="bg-[var(--ink)] text-[var(--paper)]">
        <div className="sw-stage min-h-[100svh] px-[var(--gutter)] py-24">
          <h2 className="display mb-12 text-[clamp(2rem,6vw,5rem)]">Selected Work</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {images.map((m) => (
              <div key={m.src} className="sw-card relative aspect-square overflow-hidden">
                <MediaImage media={m} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="selected" ref={scope} className="bg-[var(--ink)] text-[var(--paper)]">
      <div
        className="sw-pin relative flex h-[100svh] items-center justify-center overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <h2 className="display pointer-events-none absolute left-[var(--gutter)] top-24 z-10 text-[clamp(2rem,6vw,5rem)] mix-blend-difference">
          Selected
          <br />
          Work
        </h2>

        <div
          className="sw-ring relative h-[1px] w-[1px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {images.map((m, i) => (
            <div
              key={m.src}
              className="sw-card absolute -left-[110px] -top-[140px] h-[280px] w-[220px] overflow-hidden bg-[var(--paper-2)]"
              style={{
                transform: `rotateY(${i * step}deg)`,
                transformOrigin: `50% 50% -${RADIUS}px`,
              }}
            >
              <MediaImage media={m} fill sizes="220px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
