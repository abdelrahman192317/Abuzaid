"use client";

import { useRef, useState } from "react";
import { useCursor } from "@/components/providers/CursorProvider";
import { useIsTouch } from "@/hooks/useIsTouch";
import type { MediaItem } from "@/lib/types";

interface VideoTileProps {
  media: MediaItem;
  className?: string;
}

/**
 * Poster-first video tile. Uses preload="metadata" + a poster so nothing heavy
 * loads until needed; the browser handles range requests. On desktop the clip
 * plays on hover (and the custom cursor shows PLAY); on touch a tap toggles it.
 */
export function VideoTile({ media, className = "" }: VideoTileProps) {
  const { setCursor } = useCursor();
  const isTouch = useIsTouch();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };
  const pauseReset = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  const onEnter = () => {
    setCursor("play");
    if (!isTouch) play();
  };
  const onLeave = () => {
    setCursor("default");
    if (!isTouch) pauseReset();
  };
  const onClick = () => {
    if (!isTouch) return; // desktop is hover-driven
    const v = ref.current;
    if (!v) return;
    if (v.paused) play();
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden bg-[var(--ink)] ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <video
        ref={ref}
        poster={media.poster}
        preload="metadata"
        playsInline
        loop
        muted
        className="h-full w-full object-cover"
      >
        <source src={media.src} type="video/mp4" />
      </video>

      {/* touch-only play affordance (desktop uses hover + custom cursor) */}
      {isTouch && !playing && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--paper)]/85 text-[var(--ink)]">
            ▶
          </span>
        </span>
      )}
    </div>
  );
}
