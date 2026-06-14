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
 * loads until played; the browser handles range requests. The custom cursor
 * switches to a PLAY state on hover; on touch a tap toggles playback.
 */
export function VideoTile({ media, className = "" }: VideoTileProps) {
  const { setCursor } = useCursor();
  const isTouch = useIsTouch();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden bg-[var(--ink)] ${className}`}
      onMouseEnter={() => setCursor("play")}
      onMouseLeave={() => setCursor("default")}
      onClick={toggle}
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

      {/* touch-only play affordance (custom cursor handles desktop) */}
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
