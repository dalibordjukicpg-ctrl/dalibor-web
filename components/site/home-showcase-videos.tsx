"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { FadeIn } from "@/components/site/fade-in";
import { HOME_SHOWCASE_CLIPS } from "@/lib/showcase-videos";

export type ShowcaseVideoItem = {
  id: string;
  title: string;
  src: string;
  poster: string;
};

type Props = {
  items: ShowcaseVideoItem[];
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
};

function ShowcaseVideoStrip({
  item,
  isLast,
}: {
  item: ShowcaseVideoItem;
  isLast: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={wrapRef}
      className={[
        "group relative w-full overflow-hidden bg-zinc-950",
        !isLast ? "border-b border-black/40" : "",
      ].join(" ")}
    >
      <div className="relative h-[clamp(12.5rem,32vh,20rem)] w-full sm:h-[clamp(15rem,36vh,24rem)] lg:h-[clamp(16rem,42vh,26rem)]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.02]"
          src={item.src}
          poster={item.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/55 transition-colors duration-500 group-hover:via-black/40"
        />
        {item.title.trim() ? (
          <h3
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            className="absolute inset-0 flex items-center justify-center px-6 text-center text-[clamp(1.35rem,3.4vw,2.65rem)] font-light leading-[1.08] tracking-tight text-white [text-shadow:0_2px_28px_rgb(0_0_0/0.55)]"
          >
            {item.title}
          </h3>
        ) : null}
      </div>
    </article>
  );
}

export function HomeShowcaseVideos({ items, ctaTitle, ctaLabel, ctaHref }: Props) {
  const clips =
    items.length > 0
      ? items
      : HOME_SHOWCASE_CLIPS.map((c) => ({ ...c, title: "" }));

  return (
    <section id="showcase" className="scroll-mt-header relative z-10 w-full overflow-hidden">
      <div className="flex w-full flex-col">
        {clips.map((item, index) => (
          <ShowcaseVideoStrip
            key={item.id}
            item={item}
            isLast={index === clips.length - 1}
          />
        ))}
      </div>

      <div className="border-t border-site-border bg-site-surface-a py-section-y">
        <ShowcaseCta ctaTitle={ctaTitle} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      </div>
    </section>
  );
}

function ShowcaseCta({
  ctaTitle,
  ctaLabel,
  ctaHref,
}: {
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  if (!ctaTitle.trim() && !ctaLabel.trim()) return null;

  return (
    <FadeIn className="mx-auto max-w-3xl px-6 text-center lg:px-16">
      {ctaTitle.trim() ? (
        <h2
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-tight tracking-tight text-site-ink"
        >
          {ctaTitle}
        </h2>
      ) : null}
      {ctaLabel.trim() ? (
        <Link
          href={ctaHref}
          className="site-btn-primary mt-8 min-h-11 rounded-full px-8 text-[10px] tracking-[0.24em] sm:text-[11px]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </FadeIn>
  );
}
