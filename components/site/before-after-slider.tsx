"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  initialPosition?: number;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Prije",
  afterAlt = "Poslije",
  className,
  initialPosition = 50,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(initialPosition);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = (x / rect.width) * 100;
    setPosition(Math.min(98, Math.max(2, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-sm border border-site-border bg-site-card shadow-site-card-lg sm:aspect-[16/9]",
        className,
      )}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        draggingRef.current = true;
        setFromClientX(e.clientX);
      }}
      role="group"
      aria-label="Uporedi prije i poslije"
    >
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(min-width: 1024px) 1100px, 100vw"
        className="object-cover"
        priority
        draggable={false}
      />

      <div
        className="absolute inset-0"
        style={{
          clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`,
        }}
        aria-hidden
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="(min-width: 1024px) 1100px, 100vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
        aria-hidden
      />

      <button
        type="button"
        className="absolute top-1/2 z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-site-border bg-site-card text-site-brand shadow-site-card-lg transition hover:scale-105 hover:border-transparent hover:bg-gradient-to-br hover:from-[var(--site-btn-primary-from)] hover:via-[var(--site-brand)] hover:to-[var(--site-btn-primary-to)] hover:text-white hover:shadow-[0_8px_28px_-8px_var(--site-brand-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-site-brand focus-visible:ring-offset-2 focus-visible:ring-offset-site-canvas sm:h-12 sm:w-12"
        style={{ left: `${position}%` }}
        aria-label="Povuci za uporedbu prije i poslije"
        onPointerDown={(e) => {
          e.stopPropagation();
          draggingRef.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
      >
        <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
      </button>

      <span className="sr-only">
        {beforeAlt} / {afterAlt} — povucite klizač lijevo-desno
      </span>
    </div>
  );
}
