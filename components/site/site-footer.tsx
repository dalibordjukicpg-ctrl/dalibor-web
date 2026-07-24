"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import { FadeIn } from "@/components/site/fade-in";
import { SiteLogo } from "@/components/site/site-logo";
import { CRAFTED_BY_HREF } from "@/lib/clinic-assets";
import type { Locale } from "@/lib/i18n";
import { resolvePublicHref } from "@/lib/resolve-public-href";
import type { SiteStringKey } from "@/lib/site-fields";

type Props = {
  locale: Locale;
  s: Record<SiteStringKey, string>;
  footerContactHref?: string | null;
};

function telHref(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? `tel:${digits}` : `tel:${digits}`;
}

const COL_TITLE =
  "mb-5 text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.22em] text-site-brand lg:text-left";

const FOOTER_COL =
  "flex flex-col items-center text-center lg:items-start lg:text-left";

function IconTile({ children }: { children: ReactNode }) {
  return (
    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-site-border bg-site-card text-site-brand shadow-site-card">
      {children}
    </span>
  );
}

export function SiteFooter({
  locale,
  s,
  footerContactHref,
}: Props) {
  const socialItems = (
    [
      { label: "Facebook" as const, href: (s["social.facebook"] ?? "").trim() },
      { label: "Instagram" as const, href: (s["social.instagram"] ?? "").trim() },
      { label: "YouTube" as const, href: (s["social.youtube"] ?? "").trim() },
      { label: "LinkedIn" as const, href: (s["social.linkedin"] ?? "").trim() },
    ] as const
  ).filter((x) => x.href.startsWith("http://") || x.href.startsWith("https://"));

  const mapsHref = (s["contact.maps_href"] ?? "").trim();
  const mapsIsUrl =
    mapsHref.startsWith("http://") || mapsHref.startsWith("https://");

  const primaryPhone = (s["contact.phone1"] ?? "").trim();
  const email = (s["contact.email"] ?? "").trim();
  const address = (s["contact.address"] ?? "").trim();
  const tagline = (s["footer.tagline"] ?? "").trim();
  const kontaktHref =
    footerContactHref ?? resolvePublicHref(locale, "/s/kontakt");
  const bookHref = resolvePublicHref(locale, s["header.cta_book_href"] || "#kontakt");

  const exploreLinks = [
    { label: s["footer.col_portfolio"], href: resolvePublicHref(locale, "/#portfolio") },
    { label: s["process.eyebrow"], href: resolvePublicHref(locale, "/#proces") },
    { label: s["home.news_eyebrow"], href: resolvePublicHref(locale, "/blog") },
    { label: s["footer.col_about_nav"], href: resolvePublicHref(locale, "/#o-nama") },
    { label: s["footer.col_contact"], href: kontaktHref },
  ];

  const contactRowClass =
    "group flex w-full max-w-md items-start justify-center gap-3 text-sm transition-colors hover:text-site-brand-accent lg:justify-start";

  return (
    <footer
      id="contact"
      className="relative z-30 shrink-0 overflow-hidden bg-site-surface-a pb-[env(safe-area-inset-bottom,0px)] text-site-muted"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-14">
        <FadeIn>
          <div className="border-b border-site-border py-14 lg:py-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:gap-10">
              <div className={`${FOOTER_COL} md:col-span-2 lg:col-span-1`}>
                <SiteLogo alt={s["org.brand"]} variant="footer" className="mb-5" />
                {tagline ? (
                  <p className="max-w-sm text-sm leading-relaxed text-site-muted">{tagline}</p>
                ) : null}
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-site-subtle">
                  {s["footer.about_body"]}
                </p>
              </div>

              <div className={FOOTER_COL}>
                <p className={COL_TITLE}>
                  {locale === "en" ? "Explore" : "Sajt"}
                </p>
                <nav
                  aria-label={locale === "en" ? "Site sections" : "Sekcije sajta"}
                  className="flex w-full max-w-md flex-col items-center gap-1 lg:items-start"
                >
                  {exploreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex min-h-[44px] items-center py-2 text-sm text-site-muted transition-colors hover:text-site-brand-accent active:text-site-brand"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className={FOOTER_COL}>
                <p className={COL_TITLE}>{s["footer.col_contact"]}</p>
                <div className="flex w-full max-w-md flex-col items-center gap-4 lg:items-stretch">
                  {primaryPhone ? (
                    <a href={telHref(primaryPhone)} className={contactRowClass}>
                      <IconTile>
                        <Phone size={15} strokeWidth={1.5} aria-hidden />
                      </IconTile>
                      <span className="font-medium text-site-ink group-hover:text-site-brand-accent">
                        {primaryPhone}
                      </span>
                    </a>
                  ) : null}
                  {email ? (
                    <a href={`mailto:${email}`} className={contactRowClass}>
                      <IconTile>
                        <Mail size={15} strokeWidth={1.5} aria-hidden />
                      </IconTile>
                      <span className="break-all font-medium text-site-ink group-hover:text-site-brand-accent">
                        {email}
                      </span>
                    </a>
                  ) : null}
                  {address ? (
                    mapsIsUrl ? (
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noreferrer"
                        className={contactRowClass}
                      >
                        <IconTile>
                          <MapPin size={15} strokeWidth={1.5} aria-hidden />
                        </IconTile>
                        <span className="font-medium text-site-ink group-hover:text-site-brand-accent">
                          {address}
                        </span>
                      </a>
                    ) : (
                      <div className="flex w-full max-w-md items-start justify-center gap-3 text-sm text-site-muted lg:justify-start">
                        <IconTile>
                          <MapPin size={15} strokeWidth={1.5} aria-hidden />
                        </IconTile>
                        {address}
                      </div>
                    )
                  ) : null}
                  <div className="flex w-full max-w-md flex-col gap-3 pt-2 sm:flex-row">
                    <Link
                      href={bookHref}
                      className="site-btn-primary h-11 min-h-[44px] flex-1 px-5 text-center text-[10px] tracking-[0.2em]"
                    >
                      {s["header.cta_book"]}
                    </Link>
                    <Link
                      href={kontaktHref}
                      className="site-btn-secondary h-11 min-h-[44px] flex-1 px-5 text-center text-[10px] tracking-[0.2em]"
                    >
                      Kontakt
                    </Link>
                  </div>
                </div>
              </div>

              <div className={FOOTER_COL}>
                <p className={COL_TITLE}>{s["footer.social_title"]}</p>
                {socialItems.length > 0 ? (
                  <div className="flex flex-col items-center gap-2 lg:items-start">
                    {socialItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[44px] items-center py-2 text-sm text-site-muted transition-colors hover:text-site-brand-accent active:text-site-brand"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="max-w-xs text-sm text-site-subtle">
                    Dodajte linkove u adminu: Footer i kontakt → Društvene mreže.
                  </p>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 items-center gap-8 border-t border-site-border py-8 lg:grid-cols-3 lg:gap-6">
          <p className="text-center text-sm text-site-subtle lg:text-left">
            © {new Date().getFullYear()} {s["footer.copyright"]}
          </p>

          <div className="flex flex-col items-center justify-center gap-1.5 text-center">
            <p className="font-header-nav text-[9px] font-medium uppercase tracking-[0.3em] text-site-subtle">
              {s["footer.crafted"]}
            </p>
            <a
              href={CRAFTED_BY_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-[min(100%,16rem)] items-center justify-center rounded-full border border-site-brand/22 bg-white px-3 py-1 text-[7.5px] font-semibold uppercase leading-tight tracking-[0.16em] text-site-brand shadow-[0_1px_6px_-2px_rgb(var(--site-brand-rgb)/0.2)] transition hover:border-site-brand/40 hover:text-site-brand-accent sm:max-w-none sm:px-3.5 sm:text-[8px]"
            >
              {s["footer.crafted_by"]}
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-site-subtle lg:justify-end">
            <Link
              href={resolvePublicHref(locale, s["footer.privacy_href"])}
              className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-site-brand-accent active:text-site-brand"
            >
              {s["footer.privacy"]}
            </Link>
            <Link
              href={resolvePublicHref(locale, s["footer.terms_href"])}
              className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-site-brand-accent active:text-site-brand"
            >
              {s["footer.terms"]}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
