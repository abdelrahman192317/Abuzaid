"use client";

import { MagneticButton } from "@/components/ui/MagneticButton";

interface ContactProps {
  heading: string;
  email: string;
  cta: { label: string; href: string };
}

/**
 * Oversized magnetic CTA. The button eases toward the cursor within a pull
 * radius wider than the button itself.
 */
export function Contact({ heading, email, cta }: ContactProps) {
  return (
    <section
      id="contact"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center gap-12 px-[var(--gutter)] text-center"
    >
      <h2 className="display max-w-[18ch] text-[clamp(2.5rem,8vw,7rem)]">{heading}</h2>

      <MagneticButton
        href={cta.href}
        strength={0.5}
        radius={220}
        className="flex h-44 w-44 items-center justify-center rounded-full bg-[var(--ink)] text-center text-sm uppercase tracking-[0.14em] text-[var(--paper)] md:h-56 md:w-56"
      >
        {cta.label}
      </MagneticButton>

      <a
        href={`mailto:${email}`}
        className="link-underline text-lg text-[var(--ink-60)]"
      >
        {email}
      </a>
    </section>
  );
}
