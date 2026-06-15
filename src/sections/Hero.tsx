"use client";

import { useEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import { useIsTouch } from "@/hooks/useIsTouch";
import type { MediaItem } from "@/lib/types";

interface HeroProps {
  name: { first: string; family: string };
  portraits: MediaItem[];
  tags: string[];
  showreelHref: string;
}

/**
 * Split name (first left / family right) around a fixed-ratio centred portrait.
 * Hover rapidly cycles portraits; leaving reverts to the default. On touch
 * there's no hover, so it slowly autoplays and responds to tap.
 */
export function Hero({ name, portraits, tags }: HeroProps) {
  const isTouch = useIsTouch();
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  // touch: slow autoplay cycle
  useEffect(() => {
    if (!isTouch) return;
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % portraits.length),
      2200
    );
    return clear;
  }, [isTouch, portraits.length]);

  const onEnter = () => {
    if (isTouch) return;
    clear();
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % portraits.length),
      130
    );
  };
  const onLeave = () => {
    if (isTouch) return;
    clear();
    setIndex(0);
  };
  const onTap = () => {
    if (isTouch) setIndex((i) => (i + 1) % portraits.length);
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-[var(--gutter)] pt-24"
    >
      {/* name + portrait — names sit beside the image and tuck over its edges
          (raised slightly) for a layered, stacked editorial look on desktop. */}
      <div className="grid w-full max-w-[1400px] grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-0">
        <h1 className="display order-2 z-20 text-center text-[clamp(2.25rem,7vw,6.5rem)] md:order-1 md:-mr-[3vw] md:-translate-y-8 md:justify-self-end md:whitespace-nowrap md:text-right">
          {name.first}
        </h1>

        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onClick={onTap}
          className="relative z-10 order-1 mx-auto aspect-[3/4] w-[min(62vw,300px)] overflow-hidden bg-[var(--paper-2)] md:order-2 md:w-[clamp(240px,22vw,340px)]"
        >
          <div className="relative h-full w-full">
            {portraits.map((p, i) => (
              <div
                key={p.src}
                className="absolute inset-0 transition-opacity duration-150"
                style={{ opacity: i === index ? 1 : 0 }}
              >
                <MediaImage
                  media={p}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 62vw, 340px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <h1 className="display order-3 z-20 text-center text-[clamp(2.25rem,7vw,6.5rem)] md:-ml-[3vw] md:-translate-y-8 md:justify-self-start md:whitespace-nowrap md:text-left">
          {name.family}
        </h1>
      </div>

      {/* floating chrome */}
      <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-28 flex justify-between font-mono text-xs text-[var(--ink-60)]">
        <span>01 — 11</span>
        <span>©{new Date().getFullYear()}</span>
      </div>

      <div className="mt-5 flex flex-col items-center gap-1 text-sm text-[var(--ink-60)] md:absolute md:right-[var(--gutter)] md:bottom-[var(--gutter)] md:mt-0 md:items-end">
        {tags.map((t) => (
          <span key={t} className="uppercase tracking-[0.12em]">
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}
