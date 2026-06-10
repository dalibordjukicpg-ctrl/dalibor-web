"use client";

import { useLayoutEffect, useState, type CSSProperties } from "react";

export type HeroRevealPhase = "idle" | "enter";

/** Ulaz hero teksta: idle = vidljivo; enter = staggered CSS animacija. */
export function useHeroRevealMotion(): HeroRevealPhase {
  const [phase, setPhase] = useState<HeroRevealPhase>("idle");

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setPhase("enter");
  }, []);

  return phase;
}

export function heroRevealClass(
  phase: HeroRevealPhase,
  variant: "default" | "accent" = "default",
): string {
  if (phase !== "enter") return "";
  return variant === "accent" ? "hero-text-enter hero-text-enter--accent" : "hero-text-enter";
}

export function heroRevealDelayStyle(delayMs: number): CSSProperties {
  return { animationDelay: `${delayMs}ms` };
}
