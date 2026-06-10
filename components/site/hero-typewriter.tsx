"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const TICK_MS = 46;
const TICK_MS_FAST = 14;
const START_TICKS = 3;
const LINE_PAUSE_TICKS = 8;
const CURSOR_HOLD_MS = 700;

type Props = {
  line1: string;
  line2: string;
  line1ClassName: string;
  line2ClassName: string;
  onDone?: () => void;
};

function normalizeHeroLine(raw: string): string {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();
}

function TypeCursor({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span className="hero-type-cursor ml-0.5 inline-block align-baseline" aria-hidden>
      |
    </span>
  );
}

function renderTypedLines(text: string) {
  const parts = text.split("\n");
  return parts.map((part, index) => (
    <span key={`${index}-${part.length}`}>
      {index > 0 ? <br /> : null}
      {part}
    </span>
  ));
}

export function HeroTypewriterHeading({
  line1,
  line2,
  line1ClassName,
  line2ClassName,
  onDone,
}: Props) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const full1 = normalizeHeroLine(line1);
  const full2 = normalizeHeroLine(line2);

  const [typed1, setTyped1] = useState("");
  const [typed2, setTyped2] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [phase, setPhase] = useState<"wait" | "line1" | "pause" | "line2" | "done">("wait");

  useLayoutEffect(() => {
    if (!full1 && !full2) {
      setPhase("done");
      setCursorVisible(false);
      onDoneRef.current?.();
      return;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tickMs = reduce ? TICK_MS_FAST : TICK_MS;

    let alive = true;
    let ticks = 0;
    let index = 0;
    let step: "delay" | "line1" | "pause" | "line2" = reduce ? "line1" : "delay";

    setTyped1("");
    setTyped2("");
    setPhase(reduce ? "line1" : "wait");
    setCursorVisible(true);

    const finish = () => {
      if (!alive) return;
      setPhase("done");
      window.setTimeout(() => {
        if (alive) setCursorVisible(false);
      }, CURSOR_HOLD_MS);
      onDoneRef.current?.();
    };

    const intervalId = window.setInterval(() => {
      if (!alive) return;
      ticks += 1;

      if (step === "delay") {
        if (ticks >= START_TICKS) {
          step = "line1";
          setPhase("line1");
          index = 0;
        }
        return;
      }

      if (step === "line1") {
        index += 1;
        setTyped1(full1.slice(0, index));
        if (index >= full1.length) {
          if (full2) {
            step = "pause";
            setPhase("pause");
            ticks = 0;
          } else {
            window.clearInterval(intervalId);
            finish();
          }
        }
        return;
      }

      if (step === "pause") {
        if (ticks >= LINE_PAUSE_TICKS) {
          step = "line2";
          setPhase("line2");
          index = 0;
        }
        return;
      }

      index += 1;
      setTyped2(full2.slice(0, index));
      if (index >= full2.length) {
        window.clearInterval(intervalId);
        finish();
      }
    }, tickMs);

    const failsafeId = window.setTimeout(() => {
      if (!alive) return;
      window.clearInterval(intervalId);
      setTyped1(full1);
      setTyped2(full2);
      setPhase("done");
      setCursorVisible(false);
      onDoneRef.current?.();
    }, 14000);

    return () => {
      alive = false;
      window.clearInterval(intervalId);
      window.clearTimeout(failsafeId);
    };
  }, [full1, full2]);

  const showCursorOnLine1 =
    cursorVisible && (phase === "wait" || phase === "line1" || phase === "pause");
  const showCursorOnLine2 = cursorVisible && phase === "line2";

  return (
    <>
      <span className={line1ClassName} aria-label={`${full1} ${full2}`.trim()}>
        <span aria-hidden="true">
          {renderTypedLines(typed1)}
          <TypeCursor visible={showCursorOnLine1} />
        </span>
      </span>
      {full2 ? (
        <span className={line2ClassName} aria-hidden="true">
          {typed2}
          <TypeCursor visible={showCursorOnLine2} />
        </span>
      ) : null}
    </>
  );
}

export function HeroTypewriterReveal({
  children,
  show,
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  show: boolean;
  delayMs?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    const t = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(t);
  }, [show, delayMs]);

  if (!show) return null;

  return (
    <span
      className={["block", className].filter(Boolean).join(" ")}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </span>
  );
}
