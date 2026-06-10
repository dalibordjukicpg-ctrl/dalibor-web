/** Javni jezici na sajtu. Aktivni: /me i /en. RU ostaje u tipovima radi kompatibilnosti sa bazom. */
export const locales = ["me", "en", "ru"] as const;

/** Jezici prikazani na sajtu i u adminu. */
export const activeLocales = ["me", "en"] as const;

export type Locale = (typeof locales)[number];

export type ActiveLocale = (typeof activeLocales)[number];

export const defaultLocale: Locale = "me";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isActiveLocale(value: string): value is ActiveLocale {
  return activeLocales.includes(value as ActiveLocale);
}

/** Kratak tekst za language switcher u headeru. */
export const LOCALE_SWITCH_LABELS: Record<ActiveLocale, string> = {
  me: "ME",
  en: "EN",
};
