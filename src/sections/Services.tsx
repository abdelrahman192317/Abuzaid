"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaImage } from "@/components/ui/MediaImage";
import { useEffect, useState } from "react";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsTouch } from "@/hooks/useIsTouch";
import type { Service } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const ROT = [-9, 7, -4, 8, -6];
const DRIFT = [18, -22, 10, -16, 14];

/**
 * Services deck. A single card sits centred over a giant "Services" wordmark on
 * a grainy ink field. Scroll spreads the deck into a wavy row of tilted cards.
 * Mobile / reduced-motion → a plain stacked grid, no animation.
 */
export function Services({ services }: { services: Service[] }) {
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const isNarrow = useIsNarrow();
  const native = reduced || isTouch || isNarrow;
  const n = services.length;
  const mid = (n - 1) / 2;

  const scope = useGsapContext<HTMLElement>(
    () => {
      if (native) return;
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card");
      if (!cards.length) return;
      const cardW = cards[0].offsetWidth || 240;
      const spacing = Math.min(cardW * 0.92, (window.innerWidth * 0.88 - cardW) / Math.max(1, n - 1));

      gsap.set(cards, { xPercent: -50, yPercent: -50, x: 0, y: 0, rotation: 0 });

      gsap.to(cards, {
        x: (i) => (i - mid) * spacing,
        y: (i) => DRIFT[i % DRIFT.length],
        rotation: (i) => ROT[i % ROT.length],
        ease: "none",
        scrollTrigger: {
          trigger: ".svc-pin",
          start: "top top",
          end: "+=160%",
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });
    },
    [native, n]
  );

  if (native) {
    return (
      <section
        id="services"
        ref={scope}
        className="relative overflow-hidden bg-[var(--ink)] px-[var(--gutter)] py-24 text-[var(--paper)]"
      >
        <div className="noise-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <h2 className="display mb-10 text-[clamp(2.5rem,12vw,5rem)] leading-none tracking-tight">
            Services
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} s={s} i={i} className="aspect-[3/4] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" ref={scope} className="relative bg-[var(--ink)] text-[var(--paper)]">
      <div className="svc-pin relative h-[100dvh] w-full overflow-hidden">
        <div className="noise-bg pointer-events-none absolute inset-0 opacity-60" />

        {/* huge wordmark backdrop */}
        <h2
          aria-label="Services"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-black uppercase leading-[0.8] tracking-[-0.06em] text-[var(--paper)] text-[clamp(8rem,28vw,26rem)]"
          style={{ fontFamily: "Impact, 'Arial Narrow', 'Helvetica Neue', sans-serif", fontStretch: "condensed" }}
        >
          Services
        </h2>

        {/* deck — cards are absolutely centred; GSAP spreads them on scroll */}
        <div className="absolute inset-0">
          {services.map((s, i) => (
            <div
              key={s.id}
              className="svc-card absolute left-1/2 top-1/2 h-[min(58vh,460px)] w-[clamp(180px,18vw,260px)] will-change-transform"
              style={{ zIndex: 10 + (n - Math.abs(i - mid)) }}
            >
              <ServiceCard s={s} i={i} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function useIsNarrow(breakpoint = 768) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return narrow;
}

function ServiceCard({
  s,
  i,
  className = "",
  style,
}: {
  s: Service;
  i: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl bg-[var(--paper-2)] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] ${className}`}
      style={style}
    >
      {s.image && (
        <MediaImage media={s.image} fill sizes="(max-width:768px) 50vw, 260px" className="object-cover" />
      )}

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,#000_55%,transparent)]" />
        <div className="relative text-[var(--paper)]">
          <span className="font-mono text-[10px] tracking-[0.2em] opacity-70">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="display mt-1 text-[1.25rem] leading-tight">{s.title}</h3>
        </div>
      </div>
    </article>
  );
}
