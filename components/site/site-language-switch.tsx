"use client";



import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";



import type { Locale } from "@/lib/i18n";

import { activeLocales, isLocale, LOCALE_SWITCH_LABELS } from "@/lib/i18n";



type Props = {

  locale: Locale;

  /** Header na početnoj iznad hero-a — svjetliji tekst i obrub. */

  onLight: boolean;

  /** Uži header na telefonu — manji dugmići i tracking. */

  compact?: boolean;

};



export function SiteLanguageSwitcher({ locale, onLight, compact = false }: Props) {

  const pathname = usePathname() ?? "/";

  const router = useRouter();

  const [busy, setBusy] = useState<Locale | null>(null);



  const shell = onLight

    ? "border-white/20 bg-black/30 text-white backdrop-blur-sm"

    : "border-site-border bg-white text-site-ink shadow-sm";



  const inactive = onLight

    ? "text-white/85 hover:bg-white/10 hover:text-white"

    : "text-site-muted hover:bg-site-surface-a hover:text-site-brand";



  const active = "site-pill-active shadow-sm";



  const go = (target: Locale) => {

    if (target === locale) return;



    const segments = pathname.split("/").filter(Boolean);

    const isPost =

      segments.length === 3 &&

      isLocale(segments[0] ?? "") &&

      segments[1] === "posts";



    if (!isPost) {

      const tail = segments.slice(1).join("/");

      router.push(tail ? `/${target}/${tail}` : `/${target}`);

      return;

    }



    setBusy(target);

    fetch(

      `/api/locale-switch?to=${encodeURIComponent(target)}&path=${encodeURIComponent(pathname)}`,

    )

      .then((r) => r.json() as Promise<{ href?: string }>)

      .then((data) =>

        router.push(typeof data.href === "string" ? data.href : `/${target}`),

      )

      .catch(() => router.push(`/${target}`))

      .finally(() => setBusy(null));

  };



  const btnSize = compact

    ? "min-h-[1.5rem] min-w-[1.7rem] rounded px-1 py-0.5 text-[8px] tracking-[0.06em] md:min-h-9 md:min-w-0 md:rounded md:px-2.5 md:py-1 md:text-[11px] md:tracking-[0.12em]"

    : "min-h-9 min-w-[2.75rem] rounded px-2 py-1 text-[10px] tracking-[0.12em] md:min-w-0 md:px-2.5 md:text-[11px]";



  return (

    <div

      role="navigation"

      aria-label="Jezik sajta"

      className={[

        "flex shrink-0 items-center gap-0 border p-0.5",

        compact ? "rounded-lg" : "rounded-md",

        shell,

      ].join(" ")}

    >

      {activeLocales.map((loc) => {

        const isCurrent = loc === locale;

        return (

          <button

            key={loc}

            type="button"

            disabled={busy !== null}

            aria-current={isCurrent ? "true" : undefined}

            onClick={() => void go(loc)}

            className={[

              "font-semibold uppercase transition",

              btnSize,

              isCurrent ? active : inactive,

              busy !== null && busy !== loc ? "opacity-50" : "",

            ].join(" ")}

          >

            {busy === loc ? "…" : LOCALE_SWITCH_LABELS[loc]}

          </button>

        );

      })}

    </div>

  );

}

