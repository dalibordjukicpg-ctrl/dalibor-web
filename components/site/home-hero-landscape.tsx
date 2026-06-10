"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  HeroTypewriterHeading,
  HeroTypewriterReveal,
} from "@/components/site/hero-typewriter";
import {
  isHeroBackgroundVideoUrl,
  isHeroBackgroundYoutubeUrl,
} from "@/lib/hero-background-media";
import type { HeroVideoAssets } from "@/lib/fallback-hero-video";
import {
  getHomeHeroVideoReady,
  getSavedHeroVideoTime,
  persistHeroVideoProgress,
  setHomeHeroVideoReady,
} from "@/lib/hero-video-session";

type Cta = { label: string; href: string };

type Props = {
  eyebrow: string;
  headingLine1: string;
  /** Drugi red — naglašen, editorijalni ton. */
  headingLine2: string;
  subheading: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  mediaUrl: string | null;
  videoAssets?: HeroVideoAssets | null;
};

export function HomeHeroLandscape({
  eyebrow,
  headingLine1,
  headingLine2,
  subheading,
  primaryCta,
  secondaryCta,
  mediaUrl,
  videoAssets,
}: Props) {
  const posterSrc = videoAssets?.posterSrc?.trim() ?? "";
  const mobileVideoSrc = videoAssets?.mobileSrc?.trim() ?? "";
  const [videoReady, setVideoReady] = useState(() => getHomeHeroVideoReady());
  const [headingDone, setHeadingDone] = useState(false);
  const headingDoneRef = useRef(false);
  const markHeadingDone = () => {
    if (headingDoneRef.current) return;
    headingDoneRef.current = true;
    setHeadingDone(true);
  };

  useEffect(() => {
    const id = window.setTimeout(markHeadingDone, 6000);
    return () => window.clearTimeout(id);
  }, []);

  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!bgRef.current || !containerRef.current) return;
      if (window.matchMedia("(max-width: 767px)").matches) {
        bgRef.current.style.setProperty("--py", "0%");
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const ratio = -rect.top / window.innerHeight;
      bgRef.current.style.setProperty("--py", `${ratio * 12}%`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const url = mediaUrl?.trim() ?? "";
  const isYoutube = url ? isHeroBackgroundYoutubeUrl(url) : false;
  const isVideo = url ? !isYoutube && isHeroBackgroundVideoUrl(url) : false;
  const isLocalImg = url.startsWith("/");

  const markVideoVisible = () => {
    setVideoReady(true);
    setHomeHeroVideoReady();
  };

  const showVideoOverlay = isVideo && !videoReady && !posterSrc;

  useLayoutEffect(() => {
    if (!isVideo || !url) return;
    const el = videoRef.current;
    if (!el) return;

    const saved = getSavedHeroVideoTime();
    const applySaved = () => {
      try {
        if (saved > 0.05 && el.duration && saved < el.duration - 0.25) {
          el.currentTime = saved;
        }
      } catch {
        /* seek blocked until metadata */
      }
      void el.play().catch(() => {});
    };

    if (saved > 0.05) {
      if (el.readyState >= 1) applySaved();
      else el.addEventListener("loadedmetadata", applySaved, { once: true });
    } else {
      void el.play().catch(() => {});
    }
  }, [isVideo, url]);

  useEffect(() => {
    if (!isVideo || !url) return;
    const el = videoRef.current;
    const section = containerRef.current;
    if (!el || !section) return;

    const tryPlay = () => {
      void el.play().catch(() => {});
    };

    tryPlay();

    const onTime = () => {
      if (el.currentTime > 0.08) {
        persistHeroVideoProgress(el.currentTime);
      }
    };
    el.addEventListener("timeupdate", onTime);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) tryPlay();
      },
      { threshold: 0.12 },
    );
    obs.observe(section);

    return () => {
      el.removeEventListener("timeupdate", onTime);
      obs.disconnect();
      if (el.currentTime > 0.08) {
        persistHeroVideoProgress(el.currentTime);
      }
    };
  }, [isVideo, url]);

  return (
    <section
      ref={containerRef}
      className="relative isolate -mt-[calc(4.75rem+env(safe-area-inset-top,0px))] overflow-hidden bg-site-canvas max-md:min-h-[min(88svh,640px)] max-md:h-[min(88svh,640px)] md:-mt-[calc(5.25rem+env(safe-area-inset-top,0px))] md:h-[100svh] md:min-h-[640px]"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 overflow-hidden md:-bottom-[6%] md:-top-[6%]"
        style={{ transform: "translateY(var(--py, 0%))" }}
        aria-hidden
      >
        <div className="absolute inset-0 z-0 bg-site-canvas" aria-hidden />
        {isYoutube && url ? (
          <iframe
            title=""
            src={`${url}?autoplay=1&mute=1&controls=0&loop=1&playlist=${url.split("/embed/")[1] ?? ""}&playsinline=1`}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[120%] w-[120%] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.35] object-cover"
            allow="autoplay; encrypted-media"
          />
        ) : isVideo && url ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={posterSrc || undefined}
              onLoadedData={markVideoVisible}
              onCanPlay={markVideoVisible}
              onPlaying={markVideoVisible}
              className="absolute inset-0 z-[1] h-full w-full min-h-full min-w-full object-cover max-md:object-[center_40%] md:object-[center_30%]"
            >
              {mobileVideoSrc ? (
                <source src={mobileVideoSrc} media="(max-width: 767px)" type="video/mp4" />
              ) : null}
              <source src={url} type="video/mp4" />
            </video>
            {showVideoOverlay ? (
              <div
                className="absolute inset-0 z-[2] bg-site-canvas transition-opacity duration-500 ease-out"
                aria-hidden
              />
            ) : null}
          </>
        ) : url && isLocalImg ? (
          <Image
            src={url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover max-md:object-[center_40%] md:object-[center_30%]"
          />
        ) : url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-full w-full object-cover max-md:object-[center_40%] md:object-[center_30%]"
          />
        ) : null}
      </div>

      <div
        aria-hidden
        className="absolute inset-0 z-[5] bg-gradient-to-r from-black/75 via-black/45 to-black/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/55 via-black/20 to-transparent md:hidden"
      />

      <div className="relative z-20 flex h-full flex-col px-5 pt-[calc(4.75rem+env(safe-area-inset-top,0px))] max-md:justify-end max-md:pb-[max(2.25rem,env(safe-area-inset-bottom,0px))] sm:px-8 md:justify-center md:px-16 md:pb-0 md:pt-[calc(5.25rem+env(safe-area-inset-top,0px))] lg:px-24 xl:px-28">
        <div className="w-full max-w-3xl max-md:mx-auto max-md:text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-white/75 sm:mb-4 sm:text-[11px]">
            {eyebrow}
          </p>

          <h1
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            className="min-h-[clamp(5.25rem,20vw,11rem)] text-balance max-w-[min(100%,28rem)] max-md:mx-auto md:min-h-[clamp(7.5rem,18vw,13rem)] md:text-left"
            aria-live="polite"
          >
            <HeroTypewriterHeading
              line1={headingLine1}
              line2={headingLine2}
              onDone={markHeadingDone}
              line1ClassName="block text-[clamp(2.1rem,7.2vw,3.15rem)] font-light leading-[1.08] tracking-tight text-white/95 [text-shadow:0_2px_28px_rgb(0_0_0/0.45)] md:text-[clamp(2.75rem,5.2vw,4.25rem)]"
              line2ClassName="mt-1 block text-[clamp(2.35rem,8.4vw,3.55rem)] font-light italic leading-[1.04] tracking-tight text-[#f5ebe0] [text-shadow:0_2px_24px_rgb(0_0_0/0.4)] md:mt-2 md:text-[clamp(3rem,5.8vw,5.25rem)]"
            />
            <HeroTypewriterReveal show={headingDone} delayMs={80}>
              <span
                className="mt-5 h-px w-16 bg-gradient-to-r from-white/20 via-[#d9c4a0] to-transparent max-md:mx-auto md:mt-6"
                aria-hidden
              />
            </HeroTypewriterReveal>
          </h1>

          <HeroTypewriterReveal show={headingDone} delayMs={200}>
            <p className="mt-5 max-w-xl text-[0.9rem] leading-relaxed text-white/80 sm:text-[1rem] md:mt-7 md:text-[1.0625rem] max-md:mx-auto">
              {subheading}
            </p>
          </HeroTypewriterReveal>

          <HeroTypewriterReveal show={headingDone} delayMs={380}>
            <div className="mt-7 flex w-full flex-col gap-3 max-md:mx-auto max-md:max-w-sm sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">
              <Link
                href={primaryCta.href}
                className="site-btn-primary h-12 min-h-[48px] flex-1 px-6 text-center text-[11px] tracking-[0.18em] active:scale-[0.98] sm:flex-none sm:px-8 sm:text-[11px]"
              >
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                className="site-btn-ghost h-12 min-h-[48px] flex-1 px-6 text-center text-[11px] tracking-[0.16em] active:scale-[0.98] sm:flex-none sm:px-8 sm:text-[11px]"
              >
                {secondaryCta.label}
                <span className="ml-1.5" aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </HeroTypewriterReveal>
        </div>

        <div className="absolute bottom-8 right-6 hidden flex-col items-center gap-3 sm:right-14 sm:flex lg:right-24">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/50">scroll</span>
          <div className="h-14 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
