"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs a GSAP setup callback inside a scoped gsap.context bound to the
 * returned ref, with automatic cleanup (reverts all tweens/ScrollTriggers
 * created inside). Re-runs when `deps` change.
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  setup: (self: gsap.Context, scope: T) => void,
  deps: unknown[] = []
) {
  const scope = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    if (!scope.current) return;
    const el = scope.current;
    const ctx = gsap.context((self) => setup(self, el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
