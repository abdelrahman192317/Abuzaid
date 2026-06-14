"use client";

import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Package } from "@/lib/types";

/**
 * Clean pricing grid — one card per package. Each CTA uses the magnetic effect.
 */
export function Packages({ packages }: { packages: Package[] }) {
  return (
    <section
      id="packages"
      className="flex min-h-[100svh] w-full flex-col justify-center px-[var(--gutter)] py-24"
    >
      <div className="mb-[6vh] flex items-baseline justify-between">
        <h2 className="display text-[clamp(2rem,6vw,5rem)]">Packages</h2>
        <span className="max-w-[26ch] text-right text-sm text-[var(--ink-60)]">
          Transparent starting points. Every project is scoped to fit.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {packages.map((p) => (
          <article
            key={p.id}
            className={`flex flex-col rounded-2xl border p-8 ${
              p.featured
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                : "border-[var(--ink)]/15 bg-[var(--paper-2)]"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="display text-2xl">{p.name}</h3>
              {p.featured && (
                <span className="rounded-full border border-current px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
                  Popular
                </span>
              )}
            </div>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="display text-[clamp(2.5rem,5vw,3.5rem)]">${p.price.toLocaleString()}</span>
              {p.period && <span className="text-sm opacity-60">{p.period}</span>}
            </div>

            <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 opacity-90">
                  <span className="opacity-50">—</span>
                  {f}
                </li>
              ))}
            </ul>

            <MagneticButton
              href={p.cta.href}
              className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.14em] ${
                p.featured
                  ? "bg-[var(--paper)] text-[var(--ink)]"
                  : "border border-[var(--ink)] text-[var(--ink)]"
              }`}
            >
              {p.cta.label}
            </MagneticButton>
          </article>
        ))}
      </div>
    </section>
  );
}
