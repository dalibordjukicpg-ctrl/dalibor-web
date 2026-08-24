import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";

export type ShareCopy = {
  siteName: string;
  ogTitle: string;
  ogDescription: string;
  /** Kratka linija na OG slici (ispod logotipa). */
  ogImageTagline: string;
};

export const SHARE_COPY: Record<Locale, ShareCopy> = {
  me: {
    siteName: "Studio",
    ogTitle: "Pejzažna arhitektura",
    ogDescription:
      "Pejzažna arhitektura, dizajn dvorišta i eksterijera sa 3D vizualizacijom i premium realizacijom.",
    ogImageTagline: "Pejzažna arhitektura i dizajn eksterijera",
  },
  en: {
    siteName: "Studio",
    ogTitle: "Landscape architecture",
    ogDescription:
      "Landscape architecture, yard design and exteriors with 3D visualization and premium execution.",
    ogImageTagline: "Landscape architecture and exterior design",
  },
  ru: {
    siteName: "Studio",
    ogTitle: "Ландшафтная архитектура",
    ogDescription:
      "Ландшафтная архитектура, дизайн двора и экстерьера с 3D-визуализацией.",
    ogImageTagline: "Ландшафтная архитектура",
  },
};

export function getShareCopy(locale: string): ShareCopy {
  return isLocale(locale) ? SHARE_COPY[locale] : SHARE_COPY.me;
}

export function localeFromPublicPath(path: string): Locale | null {
  const seg = path.replace(/^\/+/, "").split("/")[0]?.toLowerCase() ?? "";
  return isLocale(seg) ? seg : null;
}

export function openGraphLocaleTag(locale: Locale): string {
  if (locale === "en") return "en_US";
  if (locale === "ru") return "ru_RU";
  return "sr_ME";
}
