"use client";

import Link from "next/link";

import { FadeIn } from "@/components/site/fade-in";
import { SiteCoverImage } from "@/components/site/site-cover-image";
import type { Locale } from "@/lib/i18n";

export type HomeBlogPost = {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverUrl?: string | null;
};

type Props = {
  eyebrow: string;
  title: string;
  readLabel: string;
  archiveHref: string;
  posts: HomeBlogPost[];
  locale: Locale;
  loadError?: string | null;
};

export function HomeBlogPreview({
  eyebrow,
  title,
  readLabel,
  archiveHref,
  posts,
  locale,
  loadError,
}: Props) {
  const err = loadError?.trim();

  return (
    <section
      id="novosti"
      className="site-section site-section-scrim-md relative z-10 scroll-mt-24 overflow-x-hidden bg-site-surface-b py-section-y"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-16">
        <FadeIn className="mb-10 flex flex-col items-start gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-site-brand sm:text-[11px]">
              {eyebrow}
            </p>
            <h2
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              className="text-[clamp(1.85rem,3.5vw,3rem)] font-light leading-[1.12] tracking-tight text-site-ink"
            >
              {title}
            </h2>
          </div>
          <Link
            href={archiveHref}
            className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-site-muted transition-colors hover:text-site-brand sm:text-[11px]"
          >
            {locale === "en" ? "View all" : "Svi članci"} →
          </Link>
        </FadeIn>

        {err ? (
          <p className="mb-8 rounded-xl border border-amber-200/80 bg-amber-50 px-5 py-4 text-sm text-amber-950">
            {err}
          </p>
        ) : null}

        {!err && posts.length === 0 ? (
          <FadeIn>
            <div className="rounded-2xl border border-site-border bg-site-card px-8 py-14 text-center">
              <p
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                className="text-lg font-light text-site-ink"
              >
                Uskoro novi članci.
              </p>
            </div>
          </FadeIn>
        ) : null}

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((post, i) => (
              <FadeIn key={post.slug} delay={((i % 3) * 100) as 0 | 100 | 200}>
                <Link
                  href={`/${locale}/posts/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-site-border bg-site-card transition-shadow duration-300 hover:shadow-site-card-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-site-surface-a">
                    {post.coverUrl ? (
                      <SiteCoverImage
                        src={post.coverUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-site-brand/8 via-site-surface-a to-site-brand/10"
                        aria-hidden
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-site-subtle">
                          Blog
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
                    <h3
                      style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                      className="text-[clamp(1.15rem,2vw,1.45rem)] font-light leading-snug tracking-tight text-site-ink"
                    >
                      {post.title}
                    </h3>
                    {post.excerpt?.trim() ? (
                      <p className="line-clamp-2 text-[0.875rem] leading-relaxed text-site-muted">
                        {post.excerpt}
                      </p>
                    ) : null}
                    <span className="mt-auto pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-site-subtle transition-colors group-hover:text-site-brand sm:text-[11px]">
                      {readLabel} →
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
