"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  PanelTop,
  Home,
  PanelBottom,
  Settings,
  Shield,
} from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { SiteLogo } from "@/components/site/site-logo";
import { AdminActionBanner } from "@/components/admin/admin-action-banner";
import { ClearSiteCacheButton } from "@/components/admin/clear-site-cache-button";
import { adminPath } from "@/lib/admin-base-path";
import {
  ADMIN_ZONE_META,
  isAdminContentPathActive,
  linksForZone,
  type AdminNavZone,
} from "@/lib/admin/site-content-nav";
import type { UserRole } from "@/lib/db/schema";
import { hasPermission, type Permission } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";

export type AdminShellNavFlags = {
  showUsers: boolean;
  showAudit: boolean;
  showAnalyticsCard: boolean;
  showBookings: boolean;
  allowCreatePost: boolean;
  allowCreatePage: boolean;
  showGlobalSiteContent: boolean;
  showPagesEntry: boolean;
  showSiteSettings: boolean;
};

function NavItem({
  href,
  label,
  hint,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  hint?: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn("admin-nav-item", active && "admin-nav-item--active")}
    >
      <span className="min-w-0 flex-1">
        <span className="admin-nav-item__label block">{label}</span>
        {hint && !active ? (
          <span className="admin-nav-item__hint mt-0.5 block">{hint}</span>
        ) : null}
      </span>
      {active ? <span className="admin-nav-item__dot" aria-hidden /> : null}
    </Link>
  );
}

function NavSection({
  title,
  icon,
  tone = "neutral",
  children,
}: {
  title: string;
  icon: ReactNode;
  tone?: "header" | "home" | "footer" | "neutral" | "cool";
  children: ReactNode;
}) {
  return (
    <section className={cn("admin-nav-section", `admin-nav-section--${tone}`)}>
      <header className="admin-nav-section__head">
        <span className="admin-nav-section__icon" aria-hidden>
          {icon}
        </span>
        <h2 className="admin-nav-section__title">{title}</h2>
      </header>
      <div className="admin-nav-section__body">{children}</div>
    </section>
  );
}

function ContentZoneNav({
  zone,
  pathname,
  onNavigate,
  can,
  icon,
  tone,
}: {
  zone: AdminNavZone;
  pathname: string;
  onNavigate?: () => void;
  can: (p: Permission) => boolean;
  icon: ReactNode;
  tone: "header" | "home" | "footer" | "neutral" | "cool";
}) {
  const links = linksForZone(zone, can);
  if (links.length === 0) return null;

  return (
    <NavSection title={ADMIN_ZONE_META[zone].title} icon={icon} tone={tone}>
      {links.map((l) => (
        <NavItem
          key={l.href}
          href={l.href}
          label={l.label}
          hint={l.frontendHint}
          active={isAdminContentPathActive(pathname, l.href)}
          onNavigate={onNavigate}
        />
      ))}
    </NavSection>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
  navFlags,
  can,
}: {
  pathname: string;
  onNavigate?: () => void;
  navFlags: AdminShellNavFlags;
  can: (p: Permission) => boolean;
}) {
  const showAdmin =
    navFlags.showUsers ||
    navFlags.showAudit ||
    navFlags.showAnalyticsCard ||
    navFlags.showBookings;

  return (
    <>
      <div className="admin-sidebar-brand">
        <Link href={adminPath()} onClick={onNavigate} className="admin-sidebar-brand__link">
          <SiteLogo variant="admin" className="max-w-[180px]" />
          <span>
            <span className="admin-sidebar-brand__sub">Upravljanje sajtom</span>
          </span>
        </Link>
        <p className="admin-sidebar-brand__meta">Header · Početna · Footer</p>
      </div>

      <nav className="admin-sidebar-nav">
        <NavSection
          title="Pregled"
          icon={<LayoutDashboard size={15} strokeWidth={2} />}
          tone="neutral"
        >
          <NavItem
            href={adminPath()}
            label="Kontrolna tabla"
            hint="Brzi pregled svih sekcija"
            active={pathname === adminPath()}
            onNavigate={onNavigate}
          />
        </NavSection>

        {navFlags.showGlobalSiteContent ? (
          <>
            <ContentZoneNav
              zone="header"
              pathname={pathname}
              onNavigate={onNavigate}
              can={can}
              icon={<PanelTop size={15} strokeWidth={2} />}
              tone="header"
            />
            <ContentZoneNav
              zone="home"
              pathname={pathname}
              onNavigate={onNavigate}
              can={can}
              icon={<Home size={15} strokeWidth={2} />}
              tone="home"
            />
            <ContentZoneNav
              zone="footer"
              pathname={pathname}
              onNavigate={onNavigate}
              can={can}
              icon={<PanelBottom size={15} strokeWidth={2} />}
              tone="footer"
            />
          </>
        ) : null}

        <ContentZoneNav
          zone="blog"
          pathname={pathname}
          onNavigate={onNavigate}
          can={can}
          icon={<BookOpen size={15} strokeWidth={2} />}
          tone="neutral"
        />

        <ContentZoneNav
          zone="media"
          pathname={pathname}
          onNavigate={onNavigate}
          can={can}
          icon={<ImageIcon size={15} strokeWidth={2} />}
          tone="neutral"
        />

        {navFlags.showPagesEntry || navFlags.showGlobalSiteContent ? (
          <ContentZoneNav
            zone="system"
            pathname={pathname}
            onNavigate={onNavigate}
            can={can}
            icon={<LayoutTemplate size={15} strokeWidth={2} />}
            tone="cool"
          />
        ) : null}

        {showAdmin ? (
          <NavSection title="Administracija" icon={<Shield size={15} strokeWidth={2} />} tone="cool">
            {navFlags.showUsers ? (
              <NavItem
                href={adminPath("users")}
                label="Korisnici i uloge"
                active={pathname.startsWith(adminPath("users"))}
                onNavigate={onNavigate}
              />
            ) : null}
            {navFlags.showAudit ? (
              <NavItem
                href={adminPath("audit")}
                label="Audit log"
                active={pathname.startsWith(adminPath("audit"))}
                onNavigate={onNavigate}
              />
            ) : null}
            {navFlags.showAnalyticsCard ? (
              <NavItem
                href={adminPath("analytics")}
                label="Analitika"
                active={pathname.startsWith(adminPath("analytics"))}
                onNavigate={onNavigate}
              />
            ) : null}
            {navFlags.showBookings ? (
              <NavItem
                href={adminPath("bookings")}
                label="Zahtjevi za termin"
                active={pathname.startsWith(adminPath("bookings"))}
                onNavigate={onNavigate}
              />
            ) : null}
          </NavSection>
        ) : null}

        {navFlags.showSiteSettings ? (
          <NavSection title="Podešavanja" icon={<Settings size={15} strokeWidth={2} />} tone="cool">
            <NavItem
              href={adminPath("settings")}
              label="Logo, favicon, održavanje"
              active={pathname.startsWith(adminPath("settings"))}
              onNavigate={onNavigate}
            />
          </NavSection>
        ) : null}
      </nav>
    </>
  );
}

export function AdminDashboardShell({
  children,
  userEmail,
  userRole,
  navFlags,
}: {
  children: React.ReactNode;
  userEmail: string;
  userRole: UserRole;
  navFlags: AdminShellNavFlags;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  const can = (p: Permission) => hasPermission(userRole, p);

  return (
    <div className="flex min-h-dvh overflow-x-clip md:flex-row">
      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
          aria-label="Zatvori meni"
          onClick={closeMenu}
        />
      ) : null}

      <aside
        className={cn(
          "admin-sidebar relative flex w-[19rem] max-w-[90vw] shrink-0 flex-col overflow-hidden",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out md:static md:z-auto md:max-w-none",
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
          <SidebarNav
            pathname={pathname}
            onNavigate={closeMenu}
            navFlags={navFlags}
            can={can}
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:ml-0">
        <header className="admin-topbar">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="admin-topbar__menu-btn md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              Meni
            </button>
            <Link href={adminPath()} className="admin-topbar__title hidden md:inline">
              Kontrolna tabla
            </Link>
          </div>
          <div className="hidden min-w-0 flex-1 flex-col items-end text-right md:flex">
            <span className="max-w-[20rem] truncate text-xs font-medium text-site-ink">
              {userEmail}
            </span>
            <span className="text-[11px] text-site-subtle">
              {userRole.replace("_", " ")} · ME, EN
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ClearSiteCacheButton />
            <form action={logoutAction}>
              <button type="submit" className="admin-topbar__logout">
                Odjavi se
              </button>
            </form>
          </div>
        </header>
        <main className="admin-main flex-1 p-4 md:p-8">
          <AdminActionBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
