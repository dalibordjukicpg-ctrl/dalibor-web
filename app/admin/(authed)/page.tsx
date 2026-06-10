import Link from "next/link";

import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { AdminPageHeader } from "@/components/admin/admin-panel";
import { AdminZoneCards } from "@/components/admin/admin-zone-cards";
import { adminPath } from "@/lib/admin-base-path";
import { linksForZone, type AdminNavZone } from "@/lib/admin/site-content-nav";
import {
  getSession,
  hasPermission,
  PERMISSIONS,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const SITE_ZONES: AdminNavZone[] = ["header", "home", "footer"];

const EXTRA_ZONES: AdminNavZone[] = ["blog", "media", "system"];

type AdminQuickLink = {
  href: string;
  title: string;
  description: string;
  permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
};

const ADMIN_QUICK_LINKS: AdminQuickLink[] = [
  {
    href: adminPath("users"),
    title: "Korisnici i uloge",
    description: "Pozivnice, aktivacija i RBAC.",
    permission: PERMISSIONS.USERS_VIEW,
  },
  {
    href: adminPath("audit"),
    title: "Audit log",
    description: "Ko je šta mijenjao u sistemu.",
    permission: PERMISSIONS.AUDIT_VIEW,
  },
  {
    href: adminPath("analytics"),
    title: "Analitika",
    description: "Pregled posjeta i izvještaji.",
    permission: PERMISSIONS.ANALYTICS_VIEW,
  },
  {
    href: adminPath("settings"),
    title: "Podešavanja sajta",
    description: "Logo, favicon i održavanje.",
    permission: PERMISSIONS.SITE_CONTENT_MANAGE,
  },
];

export default async function AdminDashboardPage() {
  const session = await getSession();
  const can = (p: (typeof PERMISSIONS)[keyof typeof PERMISSIONS]) =>
    session ? hasPermission(session.role, p) : false;

  const adminLinks = ADMIN_QUICK_LINKS.filter((l) => can(l.permission));

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <AdminPageHeader
        title="Kontrolna tabla"
        description="Sadržaj je organizovan kao na sajtu: Header, Početna, Footer. Kliknite sekciju — bez skrivenih putanja."
      />

      <AdminFrontendHint>
        Javni sajt: <strong>/me</strong> (crnogorski) i <strong>/en</strong> (engleski). Izmjene
        ovdje se odmah vide nakon čuvanja.
      </AdminFrontendHint>

      <div className="space-y-8">
        {SITE_ZONES.map((zone) => (
          <AdminZoneCards
            key={zone}
            zone={zone}
            links={linksForZone(zone, can)}
          />
        ))}
      </div>

      <div className="space-y-8">
        {EXTRA_ZONES.map((zone) => (
          <AdminZoneCards
            key={zone}
            zone={zone}
            links={linksForZone(zone, can)}
          />
        ))}
      </div>

      {adminLinks.length > 0 ? (
        <section className="admin-zone-block">
          <header className="admin-zone-block__head">
            <h2 className="admin-zone-block__title">Administracija</h2>
            <p className="admin-zone-block__desc">
              Korisnici, audit i napredna podešavanja — ne utiču direktno na izgled sajta.
            </p>
          </header>
          <div className="admin-zone-block__grid">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="admin-zone-card group">
                <h3 className="admin-zone-card__title">{link.title}</h3>
                <p className="admin-zone-card__hint">{link.description}</p>
                <span className="admin-zone-card__cta">Otvori →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
