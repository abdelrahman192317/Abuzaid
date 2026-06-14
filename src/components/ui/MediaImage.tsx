"use client";

import Image from "next/image";
import type { MediaItem } from "@/lib/types";
import { blurMap } from "@/lib/blur";

interface MediaImageProps {
  media: MediaItem;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fill?: boolean;
}

/**
 * Thin wrapper over next/image that auto-applies the generated LQIP blur
 * placeholder. Use `fill` inside a positioned, fixed-ratio container; otherwise
 * the intrinsic width/height from the MediaItem are used.
 */
export function MediaImage({
  media,
  priority = false,
  sizes = "100vw",
  className = "",
  fill = false,
}: MediaImageProps) {
  const blur = media.blurDataURL ?? blurMap[media.src];
  const src = media.type === "video" ? media.poster ?? media.src : media.src;

  const common = {
    src,
    alt: media.alt,
    priority,
    loading: priority ? undefined : ("lazy" as const),
    sizes,
    className,
    ...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {}),
  };

  if (fill) {
    return <Image {...common} fill />;
  }
  return <Image {...common} width={media.width} height={media.height} />;
}
