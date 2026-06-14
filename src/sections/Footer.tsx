"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/useGsapContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { NavLink } from "@/lib/types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  name: { first: string; family: string };
  statement: string;
  links: NavLink[];
}

/**
 * Full-screen "back cover" — flips up into view like closing a book. Reduced
 * motion → a simple fade.
 */
export function Footer({ name, statement, links }: FooterProps) {
  const reduced = usePrefersReducedMotion();

  const scope = useGsapContext<HTMLElement>(
    () => {
      const cover = ".footer-cover";
      if (reduced) {
        gsap.fromTo(
          cover,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            scrollTrigger: { trigger: scope.current, start: "top 80%" },
          }
        );
        return;
      }
      gsap.fromTo(
        cover,
        { rotateX: -88, transformOrigin: "top center", autoAlpha: 0.4 },
        {
          rotateX: 0,
          autoAlpha: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "top top",
            scrub: 0.8,
          },
        }
      );
    },
    [reduced]
  );

  return (
    <footer
      ref={scope as React.RefObject<HTMLElement>}
      className="relative w-full"
      style={{ perspective: "1400px" }}
    >
      <div className="footer-cover flex min-h-[100svh] w-full flex-col justify-between bg-[var(--ink)] px-[var(--gutter)] py-[var(--gutter)] text-[var(--paper)] will-change-transform">
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">
            (Back cover)
          </span>
          <a href="#hero" className="link-underline text-xs uppercase tracking-[0.2em]">
            Back to top ↑
          </a>
        </div>

        <p className="display max-w-[16ch] text-[clamp(2.5rem,9vw,8rem)]">{statement}</p>

        <div className="flex flex-col gap-6 border-t border-[var(--paper)]/20 pt-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-underline text-sm uppercase tracking-[0.12em]"
              >
                {l.label}
              </a>
            ))}
          </div>
          <span className="font-[family-name:var(--font-display)] text-2xl">
            {name.first} {name.family}
          </span>
          <span className="text-xs opacity-60">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
