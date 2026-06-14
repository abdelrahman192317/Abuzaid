"use client";

import { useEffect, useState } from "react";

/**
 * True on touch / no-hover devices. Used to disable the custom cursor,
 * magnetic buttons and hover-only interactions. SSR-safe (starts false,
 * resolves on mount).
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isTouch;
}
