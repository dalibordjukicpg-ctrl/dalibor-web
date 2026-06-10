"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal, flushSync } from "react-dom";

import { SiteLanguageSwitcher } from "@/components/site/site-language-switch";
import { SiteLogo } from "@/components/site/site-logo";
import type { Locale } from "@/lib/i18n";
import type { PublicNavItem } from "@/lib/queries/site";
import { resolvePublicHref } from "@/lib/resolve-public-href";
import type { SiteStringKey } from "@/lib/site-fields";

type Props = {
  locale: Locale;
  s: Record<SiteStringKey, string>;
  nav: PublicNavItem[];
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function flattenNav(nav: PublicNavItem[]): PublicNavItem[] {
  return nav.map((item) => ({
    ...item,
    children: [],
  }));
}

function navigateToHash(pathname: string, hash: string) {
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `${pathname}${hash}`);
    return;
  }
  window.location.assign(`${pathname}${hash}`);
}

function NavLink({
  href,
  label,
  onLight,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  onLight: boolean;
  onClick?: (e: ReactMouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}) {
  const base =
    "font-header-nav text-[10px] font-light uppercase tracking-[0.28em] transition-colors md:text-[11px]";
  const tone = onLight
    ? "text-white/90 hover:text-site-brand-accent"
    : "text-site-muted hover:text-site-brand-accent";

  if (isExternalHref(href)) {
    return (
      <a href={href} className={`${base} ${tone} ${className}`} onClick={onClick}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} scroll className={`${base} ${tone} ${className}`} onClick={onClick}>
      {label}
    </Link>
  );
}

export function SiteHeader({ locale, s, nav }: Props) {
  const pathname = usePathname() ?? "/";
  const isHome = /^\/(me|en)\/?$/.test(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const onHero = isHome && !scrolled;
  const items = flattenNav(nav);
  const bookHref = resolvePublicHref(locale, s["header.cta_book_href"] || "#kontakt");
  const brandName = s["org.brand"].trim();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  const handleNavClick = (href: string) => (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (isExternalHref(href)) {
      flushSync(() => closeMenu());
      return;
    }
    try {
      const target = new URL(href, window.location.origin);
      const here = new URL(window.location.href);
      if (target.pathname === here.pathname && target.hash) {
        e.preventDefault();
        flushSync(() => closeMenu());
        navigateToHash(target.pathname, target.hash);
      } else {
        flushSync(() => closeMenu());
      }
    } catch {
      flushSync(() => closeMenu());
    }
  };

  const headerShell = onHero
    ? "bg-transparent text-white"
    : "bg-white/95 text-site-ink shadow-[0_1px_0_rgb(0_0_0/0.04)] backdrop-blur-md";

  const mobileMenu = mounted && menuOpen
    ? createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={locale === "en" ? "Navigation menu" : "Navigacioni meni"}
          className="fixed inset-0 z-[200] flex flex-col bg-site-canvas text-site-ink"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgb(var(--site-brand-rgb)/0.06),transparent_55%)]"
          />
          <div className="relative flex items-center justify-between px-5 py-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
            <SiteLogo alt={brandName} variant="mobileMenu" />
            <button
              type="button"
              aria-label={locale === "en" ? "Close menu" : "Zatvori meni"}
              onClick={closeMenu}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-site-border bg-white shadow-site-card"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav
            className="relative flex flex-1 flex-col justify-center px-5 sm:px-6"
            aria-label={locale === "en" ? "Mobile navigation" : "Mobilna navigacija"}
          >
            <ul className="divide-y divide-site-border/70 rounded-2xl border border-site-border/80 bg-white/90 shadow-site-card-lg backdrop-blur-sm">
              {items.map((item) => (
                <li key={item.id}>
                  <NavLink
                    href={resolvePublicHref(locale, item.href)}
                    label={item.label}
                    onLight={false}
                    onClick={handleNavClick(resolvePublicHref(locale, item.href))}
                    className="flex min-h-[52px] w-full items-center px-5 py-3.5 text-[12px] tracking-[0.2em] active:bg-site-surface-a sm:text-[13px]"
                  />
                </li>
              ))}
            </ul>
          </nav>
          <div className="relative space-y-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-[max(1.75rem,env(safe-area-inset-bottom))]">
            <Link
              href={bookHref}
              onClick={() => closeMenu()}
              className="site-btn-primary flex h-12 min-h-[48px] w-full text-[10px] tracking-[0.22em]"
            >
              {s["header.cta_book"]}
            </Link>
            <SiteLanguageSwitcher locale={locale} onLight={false} />
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${headerShell}`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex h-[4.75rem] max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8 lg:h-[5.25rem] lg:px-12">
          <Link
            href={`/${locale}`}
            className="site-header-logo-link relative z-10 flex min-h-[44px] min-w-0 shrink items-center gap-3"
          >
            <SiteLogo
              alt={brandName}
              variant={onHero ? "headerOnHero" : "header"}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex xl:gap-10" aria-label="Glavna navigacija">
            {items.map((item) => (
              <NavLink
                key={item.id}
                href={resolvePublicHref(locale, item.href)}
                label={item.label}
                onLight={onHero}
                onClick={handleNavClick(resolvePublicHref(locale, item.href))}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <SiteLanguageSwitcher locale={locale} onLight={onHero} compact />
            </div>
            <Link
              href={bookHref}
              className={
                onHero
                  ? "site-btn-ghost font-header-nav hidden h-11 min-h-[44px] px-5 text-[10px] font-normal tracking-[0.26em] sm:inline-flex lg:px-6"
                  : "site-btn-primary site-header-cta font-header-nav hidden h-11 min-h-[44px] px-5 text-[10px] font-normal tracking-[0.26em] sm:inline-flex lg:px-6"
              }
            >
              {s["header.cta_book"]}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={locale === "en" ? "Open menu" : "Otvori meni"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className={
                onHero
                  ? "flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/25 text-white active:bg-white/10 lg:hidden"
                  : "flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-site-border bg-white/80 text-site-ink shadow-site-card active:bg-site-surface-a lg:hidden"
              }
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
