"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VideoTile } from "@/components/ui/VideoTile";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsTouch } from "@/hooks/useIsTouch";
import type { MediaItem } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Vertical scroll drives horizontal motion. The custom cursor becomes a PLAY
 * button over the videos. On touch (or reduced motion) it degrades to a native
 * horizontal swipe track — no scroll-jacking.
 */
export function VideoWork({ videos }: { videos: MediaItem[] }) {
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const native = reduced || isTouch;

  const scope = useGsapContext<HTMLElement>(
    () => {
      if (native) return;
      const track = document.querySelector<HTMLElement>(".vw-track");
      if (!track) return;
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: ".vw-pin",
          start: "top top",
          end: () => "+=" + (track.scrollWidth - window.innerWidth),
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          refreshPriority: 2,
        },
      });
    },
    [native, videos.length]
  );

  const Heading = (
    <div className="flex h-full min-w-[40vw] shrink-0 flex-col justify-center pr-[6vw]">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-60)]">
        (Video Work)
      </span>
      <h2 className="display mt-3 text-[clamp(2.5rem,7vw,6rem)]">
        Films &<br />
        Motion
      </h2>
      <p className="mt-4 max-w-[34ch] text-sm text-[var(--ink-60)]">
        Selected motion work. Hover to play — or tap through on touch.
      </p>
    </div>
  );

  if (native) {
    const mobileTiles = videos.slice(0, 4);
    return (
      <section id="video" ref={scope as React.RefObject<HTMLElement>} className="bg-[var(--paper)]">
        <div className="flex min-h-[100svh] flex-col justify-center px-[var(--gutter)] py-[10vh]">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-60)]">
            (Video Work)
          </span>
          <h2 className="display mt-3 text-[clamp(2.5rem,9vw,5rem)]">
            Films &<br />
            Motion
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {mobileTiles.map((v) => (
              <div key={v.src} className="aspect-square overflow-hidden">
                <VideoTile media={v} className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const tiles = videos.map((v, i) => (
    <div
      key={v.src}
      className="aspect-[9/16] h-[72vh] shrink-0"
      style={{ marginRight: i === videos.length - 1 ? 0 : "2vw" }}
    >
      <VideoTile media={v} className="h-full w-full" />
    </div>
  ));

  return (
    <section id="video" ref={scope as React.RefObject<HTMLElement>} className="bg-[var(--paper)]">
      <div className="vw-pin relative flex h-[100svh] items-center overflow-hidden">
        <div className="vw-track flex items-center pl-[var(--gutter)] will-change-transform">
          {Heading}
          {tiles}
        </div>
      </div>
    </section>
  );
}
