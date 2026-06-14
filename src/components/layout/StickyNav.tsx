"use client";

import { useEffect, useRef, useState } from "react";
import type { NavLink } from "@/lib/types";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface StickyNavProps {
  name: { first: string; family: string };
  links: NavLink[];
  cta: { label: string; href: string };
}

/**
 * Fixed top navigation. Hides on scroll-down, reappears on scroll-up. The CTA
 * uses the shared magnetic effect.
 */
export function StickyNav({ name, links, cta }: StickyNavProps) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY.current && y > 160) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`flex items-center justify-between px-[var(--gutter)] py-5 transition-colors duration-500 ${
          scrolled ? "bg-[var(--paper)]/80 backdrop-blur-md" : ""
        }`}
      >
        <a
          href="#hero"
          className="font-[family-name:var(--font-display)] text-lg tracking-tight"
        >
          {name.first[0]}
          {name.family[0]}.
        </a>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-underline uppercase tracking-[0.12em] text-[var(--ink)]/80 hover:text-[var(--ink)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <MagneticButton
          href={cta.href}
          className="rounded-full border border-[var(--ink)] px-5 py-2 text-xs uppercase tracking-[0.14em]"
        >
          {cta.label}
        </MagneticButton>
      </div>
    </header>
  );
}
