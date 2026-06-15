"use client";

import { useFrameSequence } from "@/hooks/useFrameSequence";

interface AboutProps {
  statement: string;
  frames: { dir: string; count: number; pad: number; ext: string };
}

/**
 * Frame-by-frame statement. The section pins and the scroll scrubs an image
 * sequence (scatter → assemble) onto a canvas instead of moving the page;
 * once the frames complete, scrolling continues to the next section.
 */
export function About({ statement, frames }: AboutProps) {
  const { sectionRef, canvasRef } = useFrameSequence({
    dir: frames.dir,
    count: frames.count,
    pad: frames.pad,
    ext: frames.ext,
    scrollLength: 4,
    refreshPriority: 6,
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-[var(--ink)] text-[var(--paper)]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-[var(--gutter)] py-[var(--gutter)]">
        <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">
          (About)
        </span>
        <p className="display max-w-[28ch] text-[clamp(1.5rem,3.4vw,3rem)] leading-[1.05]">
          {statement}
        </p>
      </div>
    </section>
  );
}
