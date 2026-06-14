"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useIsTouch } from "@/hooks/useIsTouch";
import type { CursorMode } from "@/components/providers/CursorProvider";

const LABELS: Partial<Record<CursorMode, string>> = {
  play: "PLAY",
  drag: "DRAG",
  view: "VIEW",
};

/**
 * Context-driven custom cursor with eased spring lag. Renders nothing on touch
 * devices (no hover), where native interactions take over.
 */
export function CustomCursor({ mode }: { mode: CursorMode }) {
  const isTouch = useIsTouch();
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (isTouch) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerout", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
    };
  }, [isTouch, x, y, visible]);

  if (isTouch) return null;

  const expanded = mode !== "default";
  const label = LABELS[mode];

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden mix-blend-difference md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-white text-[10px] font-medium uppercase tracking-[0.2em] text-black"
        animate={{
          width: expanded ? 72 : 10,
          height: expanded ? 72 : 10,
          opacity: visible ? 1 : 0,
          x: expanded ? -36 : -5,
          y: expanded ? -36 : -5,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}
