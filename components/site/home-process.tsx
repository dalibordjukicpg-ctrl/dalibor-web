"use client";

import Link from "next/link";

import { FadeIn } from "@/components/site/fade-in";

export type HomeProcessStep = {
  number: string;
  title: string;
  description: string;
};

type Props = {
  eyebrow: string;
  title: string;
  steps: HomeProcessStep[];
  ctaLabel: string;
  ctaHref: string;
};

const displayFont = { fontFamily: "var(--font-display), Georgia, serif" } as const;

export function HomeProcess({ eyebrow, title, steps, ctaLabel, ctaHref }: Props) {
  return (
    <section
      id="proces"
      className="site-section scroll-mt-header relative z-10 overflow-hidden bg-gradient-to-b from-white via-[#faf9f7] to-white py-section-y"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-8%,rgb(var(--site-brand-rgb)/0.07),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--site-luxury-rgb)/0.35)] to-transparent"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <FadeIn className="mb-14 max-w-3xl md:mb-20">
          <div className="mb-5 flex items-center gap-3">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-site-brand via-site-brand-accent to-site-luxury"
            />
            <p className="font-header-nav text-[10px] font-medium uppercase tracking-[0.38em] text-site-brand-muted sm:text-[11px]">
              {eyebrow}
            </p>
          </div>
          <h2
            style={displayFont}
            className="text-balance text-[clamp(2.1rem,4.8vw,3.85rem)] font-light leading-[1.06] tracking-[-0.02em] text-site-ink [text-shadow:0_1px_0_rgb(255_255_255/0.8)]"
          >
            {title}
          </h2>
          <div
            aria-hidden
            className="mt-8 h-px max-w-sm bg-gradient-to-r from-site-border via-[rgb(var(--site-luxury-rgb)/0.45)] to-transparent"
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={((i % 4) * 100) as 0 | 100 | 200 | 300}>
              <article className="premium-touch-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgb(var(--site-brand-rgb)/0.08)] bg-white/95 p-6 shadow-[0_4px_24px_-8px_rgb(0_0_0/0.08),0_12px_40px_-16px_rgb(var(--site-brand-rgb)/0.1)] backdrop-blur-sm transition-all duration-500 sm:p-8">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-site-brand via-site-brand-accent to-site-luxury opacity-90"
                />
                <span
                  aria-hidden
                  style={displayFont}
                  className="pointer-events-none absolute -right-1 -top-3 select-none text-[5rem] font-light leading-none text-[rgb(var(--site-brand-rgb)/0.07)] transition-colors duration-500 group-hover:text-[rgb(var(--site-brand-rgb)/0.11)] sm:text-[5.5rem]"
                >
                  {step.number}
                </span>

                <p className="relative mb-5 font-header-nav text-[10px] font-medium uppercase tracking-[0.34em] text-site-brand">
                  Step {step.number}
                </p>
                <h3
                  style={displayFont}
                  className="relative mb-4 text-[1.3rem] font-normal leading-[1.2] tracking-[-0.01em] text-site-ink sm:text-[1.45rem]"
                >
                  {step.title}
                </h3>
                <p className="relative flex-1 text-[0.9rem] leading-[1.8] text-site-muted sm:text-[0.9375rem]">
                  {step.description}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>

        {ctaLabel.trim() ? (
          <FadeIn className="mt-16 flex justify-center md:mt-20">
            <Link
              href={ctaHref}
              className="site-btn-primary h-12 px-12 text-[10px] tracking-[0.26em] shadow-[0_10px_32px_-10px_var(--site-brand-glow)] transition-shadow duration-300 hover:shadow-[0_14px_40px_-8px_var(--site-brand-glow)] sm:h-[3.25rem] sm:text-[11px]"
            >
              {ctaLabel}
            </Link>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
