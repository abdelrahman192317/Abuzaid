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
export function FeaturedProject({ title: _title, subtitle: _subtitle, clips }: FeaturedProjectProps) {
  const reduced = usePrefersReducedMotion();

  const scope = useGsapContext<HTMLElement>(
    () => {
      if (reduced) {
        gsap.set(".feat-frame", { scale: 1 });
        return;
      }
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".feat-pin",
            start: "top top",
            end: "+=180%",
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
            refreshPriority: 3,
          },
        })
        .fromTo(
          ".feat-frame",
          { scale: 0.55 },
          { scale: 1, ease: "none" }
        );
    },
    [reduced, clips.length]
  );

  const mobileClip = clips[0];

  return (
    <section id="featured" ref={scope as React.RefObject<HTMLElement>} className="bg-[var(--paper)]">
      <div className="feat-pin relative h-[100dvh] w-full overflow-hidden">
        <div className="feat-frame absolute inset-4 origin-center overflow-hidden rounded-[28px] md:inset-8">
          {/* Mobile: single reel fills the frame. Desktop: three side-by-side. */}
          <div className="hidden h-full w-full grid-cols-3 gap-[2px] md:grid">
            {clips.slice(0, 3).map((c) => (
              <VideoTile key={c.src} media={c} className="h-full w-full" />
            ))}
          </div>
          {mobileClip && (
            <div className="flex h-full w-full md:hidden">
              <VideoTile media={mobileClip} className="h-full w-full" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
