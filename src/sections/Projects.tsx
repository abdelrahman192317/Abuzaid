"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaImage } from "@/components/ui/MediaImage";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useCursor } from "@/components/providers/CursorProvider";
import type { Project } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Gentle feather on the sharp image so its edge melts into the blurred halo
// without eating into the photo.
const SHARP_FADE = {
  WebkitMaskImage:
    "radial-gradient(ellipse 88% 86% at 50% 50%, #000 72%, transparent 100%)",
  maskImage:
    "radial-gradient(ellipse 88% 86% at 50% 50%, #000 72%, transparent 100%)",
} as const;

// Wider, softer feather for the blurred halo copy behind the photo.
const HALO_FADE = {
  WebkitMaskImage:
    "radial-gradient(ellipse 80% 80% at 50% 50%, #000 25%, transparent 78%)",
  maskImage:
    "radial-gradient(ellipse 80% 80% at 50% 50%, #000 25%, transparent 78%)",
} as const;

/**
 * The centred figure: a glowing, blurred-haloed photo with the project title
 * laid faintly over it on a dark stage.
 */
function Figure({
  project,
  index,
  total,
  priority,
}: {
  project: Project;
  index: number;
  total: number;
  priority: boolean;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative aspect-[4/5] h-[min(72vh,620px)]">
        {/* white light bloom */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[28%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.20),transparent_60%)] blur-3xl"
        />
        {/* blurred copy → big soft halo of the photo's own colour */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 scale-[1.18] blur-[52px] opacity-70"
          style={HALO_FADE}
        >
          <MediaImage media={project.cover} fill sizes="60vh" className="object-cover" />
        </div>
        {/* the sharp photo */}
        <div className="absolute inset-0" style={SHARP_FADE}>
          <MediaImage
            media={project.cover}
            fill
            priority={priority}
            sizes="(max-width:768px) 90vw, 50vh"
            className="object-cover"
          />
        </div>
      </div>

      {/* title + labels, faint, can exceed the photo width */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="mb-4 font-mono text-[11px] uppercase tracking-[0.45em] text-[var(--accent)]/85">
          {project.category}
        </span>
        <h3 className="display whitespace-nowrap text-[clamp(2.2rem,9vw,7rem)] font-light tracking-[0.05em] text-white/35">
          {project.title}
        </h3>
        <span className="mt-6 font-mono text-[11px] uppercase tracking-[0.4em] text-white/45">
          View project
        </span>
      </div>

      <span className="pointer-events-none absolute -bottom-[7vh] left-1/2 -translate-x-1/2 font-mono text-xs text-white/35">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

/**
 * Center-focus showcase. The section PINS and scrolling flips one project to
 * the next in place — each photo cross-fades/scales in like dealing a deck —
 * instead of scrolling through a tall column. Dark stage so the imagery holds
 * all the attention. Reduced motion → a simple stacked, scrollable fallback.
 */
export function Projects({ projects }: { projects: Project[] }) {
  const reduced = usePrefersReducedMotion();
  const { setCursor } = useCursor();
  const total = projects.length;

  const scope = useGsapContext<HTMLElement>(
    () => {
      if (reduced) return;
      const slides = gsap.utils.toArray<HTMLElement>(".proj-slide");
      if (!slides.length) return;

      gsap.set(slides, { autoAlpha: 0, scale: 0.94 });
      gsap.set(slides[0], { autoAlpha: 1, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".proj-pin",
          start: "top top",
          end: `+=${total * 100}%`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          refreshPriority: 4,
        },
      });

      for (let i = 1; i < slides.length; i++) {
        tl.to(slides[i - 1], {
          autoAlpha: 0,
          scale: 1.06,
          yPercent: -3,
          duration: 0.6,
          ease: "power1.in",
        })
          .fromTo(
            slides[i],
            { autoAlpha: 0, scale: 0.94, yPercent: 3 },
            { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.6, ease: "power1.out" },
            "<"
          )
          .to({}, { duration: 0.3 }); // brief hold on each project
      }
    },
    [reduced, total]
  );

  const eyebrow = (
    <span className="pointer-events-none absolute left-[var(--gutter)] top-[6vh] z-20 font-mono text-xs uppercase tracking-[0.2em] text-[var(--paper)]/40">
      (Selected Projects)
    </span>
  );

  if (reduced) {
    return (
      <section id="projects" ref={scope} className="relative w-full bg-[var(--ink)] text-[var(--paper)]">
        {eyebrow}
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="relative flex min-h-[100dvh] items-center justify-center px-[var(--gutter)]"
          >
            <Figure project={p} index={i} total={total} priority={i === 0} />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section id="projects" ref={scope} className="relative w-full bg-[var(--ink)] text-[var(--paper)]">
      <div
        className="proj-pin relative flex h-[100dvh] items-center justify-center overflow-hidden"
        onMouseEnter={() => setCursor("view")}
        onMouseLeave={() => setCursor("default")}
      >
        {eyebrow}
        {projects.map((p, i) => (
          <article
            key={p.id}
            className="proj-slide absolute inset-0 flex items-center justify-center px-[var(--gutter)] will-change-transform"
          >
            <Figure project={p} index={i} total={total} priority={i === 0} />
          </article>
        ))}
      </div>
    </section>
  );
}
