"use client";

import { FadeIn } from "@/components/site/fade-in";

export type HomeTestimonial = {
  id: string;
  name: string;
  quote: string;
};

type Props = {
  title: string;
  items: HomeTestimonial[];
};

export function HomeTestimonials({ title, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="relative z-10 overflow-x-hidden bg-site-surface-b py-section-y text-site-ink">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <FadeIn className="mb-12 md:mb-16">
          <h2
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-[1.1] tracking-tight"
          >
            {title}
          </h2>
        </FadeIn>

        <div className="-mx-5 flex gap-6 overflow-x-auto px-5 pb-4 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-8">
          {items.map((item, i) => (
            <FadeIn
              key={item.id}
              delay={((i % 3) * 100) as 0 | 100 | 200}
              className="min-w-[min(100%,18rem)] shrink-0 sm:min-w-0"
            >
              <figure className="flex h-full flex-col rounded-xl border border-site-border bg-white p-6 shadow-site-card sm:p-7">
                <blockquote className="flex-1 text-[1rem] font-light leading-[1.7] text-site-muted sm:text-[1.0625rem]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-site-border pt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-site-subtle">
                  {item.name}
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
