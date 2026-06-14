"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useIsTouch } from "@/hooks/useIsTouch";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** How strongly the button follows the cursor (0–1). */
  strength?: number;
  /** Pull radius in px, larger than the button itself. */
  radius?: number;
  ariaLabel?: string;
}

/**
 * CTA wrapper with a magnetic pull: the element eases toward the cursor while
 * the pointer is within `radius` (wider than the button), then springs back.
 * Falls back to a plain, static element on touch devices.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  strength = 0.4,
  radius = 140,
  ariaLabel,
}: MagneticButtonProps) {
  const isTouch = useIsTouch();
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [isTouch, radius, strength, x, y]);

  const content = (
    <motion.span
      className="inline-flex items-center justify-center"
      style={isTouch ? undefined : { x: sx, y: sy }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a ref={ref} href={href} aria-label={ariaLabel} className={className} onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" aria-label={ariaLabel} className={className} onClick={onClick}>
      {content}
    </button>
  );
}
