"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaImage } from "@/components/ui/MediaImage";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Service } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Subtle, hand-laid wave (per card): a little tilt and a little vertical drift.
const ROT = [-7, 5, -3, 6, -4, 7, -5, 4];
const DRIFT = [14, -18, 8, -14, 10, -12, 16, -10];

/**
 * Card spread. The services begin stacked as a deck, then scrolling spreads
 * them apart into a gentle wavy row (each card slightly tilted/drifted — not a
 * circular fan). Each card is a full-bleed image with the label on a frosted
 * strip at the bottom. Reduced motion → a plain responsive grid.
 */
export function Services({ services }: { services: Service[] }) {
  const reduced = usePrefersReducedMotion();
  const n = services.length;
  const mid = (n - 1) / 2;

  const scope = useGsapContext<HTMLElement>(
    () => {
      if (reduced) return;
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card");
      if (!cards.length) return;
      const cardW = cards[0].offsetWidth || 240;
      // fit the spread to the viewport; cards overlap a little on narrow screens
      const spacing = Math.min(cardW * 0.86, (window.innerWidth * 0.92 - cardW) / Math.max(1, n - 1));

      // Start: every card stacked dead-centre, looking like one card.
      gsap.set(cards, { xPercent: -50, yPercent: -50, x: 0, y: 0, rotation: 0 });

      // Scroll spreads them symmetrically outward into the wavy row.
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
    [reduced, n]
  );

  if (reduced) {
    return (
      <section id="services" ref={scope} className="bg-[var(--ink)] px-[var(--gutter)] py-24 text-[var(--paper)]">
        <h2 className="display mb-12 text-[clamp(2rem,6vw,5rem)]">Services</h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="services" ref={scope} className="bg-[var(--ink)] text-[var(--paper)]">
      <div className="svc-pin relative flex h-[100svh] items-center justify-center overflow-hidden">
        <h2 className="display pointer-events-none absolute left-[var(--gutter)] top-[10vh] z-20 text-[clamp(2rem,6vw,5rem)]">
          Services
        </h2>
        {services.map((s, i) => (
          <ServiceCard
            key={s.id}
            s={s}
            i={i}
            className="svc-card absolute left-1/2 top-1/2 h-[min(58vh,460px)] w-[clamp(150px,17vw,240px)] will-change-transform"
            style={{ zIndex: n - Math.abs(i - mid) }}
          />
        ))}
      </div>
    </section>
  );
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
      {/* full-bleed image */}
      {s.image && (
        <MediaImage media={s.image} fill sizes="(max-width:768px) 50vw, 240px" className="object-cover" />
      )}

      {/* frosted label strip at the bottom */}
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
