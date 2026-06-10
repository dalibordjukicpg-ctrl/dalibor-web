import type { Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";
import type { MachineTranslateTarget } from "@/lib/machine-translate";
import type { PublicNavItem } from "@/lib/queries/site";
import {
  isMachineTranslateTarget,
  isNavRuntimeTranslateEnabled,
  translateNavPlainForLocale,
} from "@/lib/runtime-translate";
import type { SiteStringKey } from "@/lib/site-fields";
import {
  applyPublicHeaderNavPolicy,
  sortPublicHeaderRoots,
} from "@/lib/site-page-header-nav";

function shallowCloneNavChildren(nodes: PublicNavItem[]): PublicNavItem[] {
  return nodes.map((c) => ({ ...c, children: [] }));
}

/** Kad baza nije dostupna — osnovni meni za pejzažni studio. */
export const FALLBACK_HEADER_NAV: PublicNavItem[] = [
  {
    id: "fallback-portfolio",
    href: "#portfolio",
    label: "Portfolio",
    children: [],
  },
  {
    id: "fallback-process",
    href: "#proces",
    label: "Proces",
    children: [],
  },
  {
    id: "fallback-about",
    href: "#o-nama",
    label: "O nama",
    children: [],
  },
  {
    id: "fallback-blog",
    href: "#novosti",
    label: "Blog",
    children: [],
  },
  {
    id: "fallback-contact",
    href: "#kontakt",
    label: "Kontakt",
    children: [],
  },
];

const FALLBACK_EN: Record<string, string> = {
  Portfolio: "Portfolio",
  Proces: "Process",
  "O nama": "About",
  Blog: "Blog",
  Kontakt: "Contact",
};

export async function resolveHeaderNav(
  nav: PublicNavItem[],
  locale: Locale,
  s?: Partial<Record<SiteStringKey, string>>,
): Promise<PublicNavItem[]> {
  let roots = nav.length > 0 ? nav : FALLBACK_HEADER_NAV;

  roots = applyPublicHeaderNavPolicy(roots);
  sortPublicHeaderRoots(roots);

  if (locale === defaultLocale || !isNavRuntimeTranslateEnabled()) {
    if (locale === "en" && nav.length === 0) {
      return roots.map((item) => ({
        ...item,
        label: FALLBACK_EN[item.label] ?? item.label,
        children: shallowCloneNavChildren(item.children),
      }));
    }
    return roots.map((item) => ({
      ...item,
      children: shallowCloneNavChildren(item.children),
    }));
  }

  if (!isMachineTranslateTarget(locale)) {
    return roots.map((item) => ({
      ...item,
      children: shallowCloneNavChildren(item.children),
    }));
  }

  const translated: PublicNavItem[] = [];
  for (const item of roots) {
    const label = await translateNavPlainForLocale(item.label, locale);
    translated.push({
      ...item,
      label,
      children: shallowCloneNavChildren(item.children),
    });
  }
  return translated;
}
