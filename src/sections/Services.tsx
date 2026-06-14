"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaImage } from "@/components/ui/MediaImage";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Service } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Card fan-out. The services begin as a single stacked deck; scrolling fans
 * them out like spreading a hand of cards — one card per service. Reduced
 * motion → a plain responsive grid.
 */
export function Services({ services }: { services: Service[] }) {
  const reduced = usePrefersReducedMotion();
  const n = services.length;
  const mid = (n - 1) / 2;

  const scope = useGsapContext<HTMLElement>(
    () => {
      if (reduced) return;
      gsap.fromTo(
        ".svc-card",
        { rotate: 0, xPercent: -50, x: 0, y: 0 },
        {
          rotate: (i) => (i - mid) * 11,
          x: (i) => (i - mid) * 150,
          y: (i) => Math.abs(i - mid) * 26,
          ease: "none",
          scrollTrigger: {
            trigger: ".svc-pin",
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 0.6,
          },
        }
      );
    },
    [reduced, n]
  );

  if (reduced) {
    return (
      <section id="services" ref={scope as React.RefObject<HTMLElement>} className="px-[var(--gutter)] py-24">
        <h2 className="display mb-12 text-[clamp(2rem,6vw,5rem)]">Services</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCardBody key={s.id} s={s} i={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="services" ref={scope as React.RefObject<HTMLElement>} className="bg-[var(--paper)]">
      <div className="svc-pin relative flex h-[100svh] items-center justify-center overflow-hidden">
        <h2 className="display pointer-events-none absolute left-[var(--gutter)] top-24 text-[clamp(2rem,6vw,5rem)]">
          Services
        </h2>
        <div className="relative h-[420px] w-full">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="svc-card absolute left-1/2 top-1/2 -mt-[210px] h-[420px] w-[300px] origin-bottom rounded-2xl border border-[var(--ink)]/12 bg-[var(--paper-2)] p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]"
              style={{ zIndex: n - Math.abs(i - mid) }}
            >
              <ServiceCardBody s={s} i={i} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCardBody({ s, i }: { s: Service; i: number }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-[var(--ink-60)]">
          {String(i + 1).padStart(2, "0")}
        </span>
        {s.image && (
          <div className="relative h-12 w-16 overflow-hidden rounded">
            <MediaImage media={s.image} fill sizes="64px" className="object-cover" />
          </div>
        )}
      </div>
      <h3 className="display mt-auto text-[1.8rem] leading-tight">{s.title}</h3>
      <p className="mt-3 text-sm text-[var(--ink-60)]">{s.description}</p>
    </div>
  );
}
