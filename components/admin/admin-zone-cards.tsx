import Link from "next/link";

import {
  ADMIN_ZONE_META,
  type AdminContentLink,
  type AdminNavZone,
} from "@/lib/admin/site-content-nav";
import { cn } from "@/lib/utils";

type Props = {
  zone: AdminNavZone;
  links: AdminContentLink[];
  className?: string;
};

export function AdminZoneCards({ zone, links, className }: Props) {
  if (links.length === 0) return null;

  const meta = ADMIN_ZONE_META[zone];

  return (
    <section className={cn("admin-zone-block", `admin-zone-block--${zone}`, className)}>
      <header className="admin-zone-block__head">
        <h2 className="admin-zone-block__title">{meta.title}</h2>
        <p className="admin-zone-block__desc">{meta.description}</p>
      </header>
      <div className="admin-zone-block__grid">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="admin-zone-card group">
            <h3 className="admin-zone-card__title">{link.label}</h3>
            <p className="admin-zone-card__hint">{link.frontendHint}</p>
            <span className="admin-zone-card__cta">Uredi →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
