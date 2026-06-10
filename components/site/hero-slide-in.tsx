"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Kašnjenje prije početka kretanja (ms). */
  delayMs?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Hero ulaz — tekst je uvijek čitljiv, ali kreće niže i klizi gore.
 * Nema opacity:0, zato je motion uvijek vidljiv.
 */
export function HeroSlideIn({ children, delayMs = 0, className = "", style }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setActive(true);
      return;
    }

    const t = window.setTimeout(() => setActive(true), 60 + delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);

  const motionStyle: CSSProperties = {
    transform: active ? "translate3d(0, 0, 0)" : "translate3d(0, 64px, 0)",
    opacity: active ? 1 : 0.25,
    transition:
      "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1)",
    ...style,
  };

  return (
    <span className={["block", className].filter(Boolean).join(" ")} style={motionStyle}>
      {children}
    </span>
  );
}
