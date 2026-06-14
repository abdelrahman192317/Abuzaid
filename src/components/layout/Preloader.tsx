"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MIN_DURATION = 1000;
const MAX_DURATION = 2000;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function decode(src: string) {
  try {
    const img = new Image();
    img.src = src;
    if (img.decode) await img.decode();
    else
      await new Promise((res) => {
        img.onload = res;
        img.onerror = res;
      });
  } catch {
    /* ignore — never block the intro on a single asset */
  }
}

interface PreloaderProps {
  /** Hero/hover-cycle image srcs to warm up behind the intro. */
  assets: string[];
  name: { first: string; family: string };
}

/**
 * Organic intro overlay. Preloads the hero assets, then reveals the page once
 * BOTH (assets decoded) AND (a minimum ~1s elapsed) — but never waits longer
 * than ~2s so slow connections aren't trapped.
 */
export function Preloader({ assets, name }: PreloaderProps) {
  const reduced = usePrefersReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    const assetsReady = Promise.all(assets.map(decode));
    const gate = Promise.race([
      Promise.all([assetsReady, wait(MIN_DURATION)]),
      wait(MAX_DURATION),
    ]);

    // count-up while we wait
    const count = { v: 0 };
    const counterTween = gsap.to(count, {
      v: 100,
      duration: MAX_DURATION / 1000,
      ease: "power1.out",
      onUpdate: () => {
        if (counterRef.current)
          counterRef.current.textContent = String(Math.round(count.v)).padStart(2, "0");
      },
    });

    let cancelled = false;
    gate.then(() => {
      if (cancelled) return;
      counterTween.kill();
      if (counterRef.current) counterRef.current.textContent = "100";

      const finish = () => {
        document.documentElement.style.overflow = "";
        setHidden(true);
        ScrollTrigger.refresh();
      };

      if (reduced || !overlayRef.current) {
        gsap.to(overlayRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          onComplete: finish,
        });
        return;
      }

      gsap
        .timeline({ onComplete: finish })
        .to(".preloader-inner", { autoAlpha: 0, duration: 0.4, ease: "power2.in" })
        .to(overlayRef.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.1,
          ease: "power4.inOut",
        });
    });

    return () => {
      cancelled = true;
      counterTween.kill();
      document.documentElement.style.overflow = "";
    };
  }, [assets, reduced]);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-end justify-between bg-[var(--ink)] px-[var(--gutter)] pb-[var(--gutter)] text-[var(--paper)]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="preloader-inner flex w-full items-end justify-between">
        <div className="font-[family-name:var(--font-display)] text-[clamp(2rem,7vw,6rem)] leading-[0.9]">
          <span className="block">{name.first}</span>
          <span className="block opacity-60">{name.family}</span>
        </div>
        <div className="font-mono text-sm tracking-widest">
          <span ref={counterRef}>00</span>
          <span className="opacity-50"> / 100</span>
        </div>
      </div>
    </div>
  );
}
