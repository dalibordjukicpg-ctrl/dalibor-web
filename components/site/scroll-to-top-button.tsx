"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 380;
const SHOW_AFTER_PX_MOBILE = 920;

/**
 * Fiksno dugme koje glatko vraća skrol na vrh (iOS / Android prijateljski —
 * safe-area-inset, min. 44px dodir).
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const threshold = mobile ? SHOW_AFTER_PX_MOBILE : SHOW_AFTER_PX;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollUp}
      className="site-scroll-top-btn fixed z-[170] flex size-11 items-center justify-center rounded-full text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-brand active:scale-[0.97] bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] left-[max(1rem,calc(env(safe-area-inset-left,0px)+0.25rem))] md:left-auto md:right-[max(1rem,calc(env(safe-area-inset-right,0px)+0.25rem))] md:size-12"
      aria-label="Na vrh stranice"
      title="Na vrh"
    >
      <ChevronUp className="size-6" strokeWidth={2} aria-hidden />
    </button>
  );
}
