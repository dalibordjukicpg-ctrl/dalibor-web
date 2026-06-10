"use client";

import Link from "next/link";
import Image from "next/image";

import { FadeIn } from "@/components/site/fade-in";

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

export function HomeAbout({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  imageUrl,
  imageAlt,
}: Props) {
  const src = imageUrl?.trim() ?? "";
  const isLocal = src.startsWith("/");
  const alt = imageAlt?.trim() || eyebrow.trim() || title.trim() || "Dizajner";

  return (
    <section
      id="o-nama"
      className="site-section relative z-10 scroll-mt-24 overflow-x-hidden bg-site-surface-a py-section-y"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <FadeIn className="order-2 lg:order-1">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-site-brand sm:text-[11px]">
              {eyebrow}
            </p>
            <h2
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              className="text-[clamp(1.85rem,3.5vw,3rem)] font-light leading-[1.12] tracking-tight text-site-ink"
            >
              {title}
            </h2>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-[1.75] text-site-muted sm:text-[1rem]">
              {body}
            </p>
            {ctaLabel.trim() ? (
              <Link
                href={ctaHref}
                className="mt-8 inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.22em] text-site-ink transition-colors hover:text-site-brand sm:text-[11px]"
              >
                {ctaLabel}
                <span className="ml-2" aria-hidden>
                  →
                </span>
              </Link>
            ) : null}
          </FadeIn>

          <FadeIn className="order-1 lg:order-2" delay={200}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-site-border bg-site-card shadow-site-card lg:aspect-[5/6]">
              {src ? (
                isLocal ? (
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
                )
              ) : (
                <div
                  className="absolute inset-0 bg-gradient-to-br from-site-brand/10 via-site-surface-b to-site-brand/5"
                  aria-hidden
                />
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
