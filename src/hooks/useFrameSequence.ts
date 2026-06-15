"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FrameSequenceOptions {
  dir: string; // e.g. "/frames"
  count: number;
  pad: number;
  ext: string;
  /** Scroll distance the pin lasts, in viewport heights. */
  scrollLength?: number;
  /** Higher = refreshed earlier, so pins higher on the page reserve space first. */
  refreshPriority?: number;
}

/**
 * Preloads a frame sequence, pins a section, and scrubs the frames onto a
 * <canvas> as the user scrolls. The pin is created SYNCHRONOUSLY on mount so it
 * reserves its scroll space immediately — otherwise the sections below it would
 * be positioned as if this one were a single screen tall, and everything would
 * overlap once the (late) pin appeared. Falls back to a single static frame +
 * no pin when the user prefers reduced motion.
 */
export function useFrameSequence(opts: FrameSequenceOptions) {
  const { dir, count, pad, ext, scrollLength = 3, refreshPriority = 0 } = opts;
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderRef = useRef<() => void>(() => {});
  const [loaded, setLoaded] = useState(false);
  const reduced = usePrefersReducedMotion();

  const prefix = dir.split("/").filter(Boolean).pop() ?? "frame";

  // Preload every frame.
  useEffect(() => {
    let active = true;
    const imgs: HTMLImageElement[] = [];
    let done = 0;
    const onOne = () => {
      done += 1;
      // redraw the current frame as soon as something is available
      renderRef.current?.();
      if (active && done >= count) setLoaded(true);
    };
    for (let i = 0; i < count; i++) {
      const img = new Image();
      img.onload = onOne;
      img.onerror = onOne;
      img.src = `${dir}/${prefix}-${String(i + 1).padStart(pad, "0")}.${ext}`;
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      active = false;
    };
  }, [dir, count, pad, ext, prefix]);

  // Set up the canvas + pin immediately (does NOT wait for frames to load).
  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = { frame: 0 };

    const drawCover = (img: HTMLImageElement) => {
      if (!img.naturalWidth) return;
      const { width: cw, height: ch } = canvas;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw = cw;
      let dh = ch;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
      } else {
        dw = cw;
        dh = cw / ir;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const render = () => {
      const idx = Math.max(0, Math.min(count - 1, Math.round(state.frame)));
      const img = imagesRef.current[idx];
      if (img) drawCover(img);
    };
    renderRef.current = render;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      render();
    };
    resize();

    const ctxGsap = gsap.context(() => {
      if (reduced) {
        // Static: just show the final assembled frame.
        state.frame = count - 1;
        render();
        return;
      }
      gsap.to(state, {
        frame: count - 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: `+=${scrollLength * 100}%`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.5,
          invalidateOnRefresh: true,
          refreshPriority,
        },
        onUpdate: render,
      });
    }, sectionRef);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      ctxGsap.revert();
    };
  }, [reduced, count, scrollLength, refreshPriority]);

  return { sectionRef, canvasRef, loaded };
}
