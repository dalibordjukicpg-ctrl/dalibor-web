import { adminPath } from "@/lib/admin-base-path";
import { PERMISSIONS, type Permission } from "@/lib/auth/permissions";

export type AdminNavZone = "header" | "home" | "footer" | "blog" | "media" | "system";

export type AdminContentLink = {
  href: string;
  label: string;
  /** Gdje se vidi na javnom sajtu */
  frontendHint: string;
  zone: AdminNavZone;
  order: number;
  anyPermission?: Permission[];
};

export const ADMIN_CONTENT_LINKS: AdminContentLink[] = [
  {
    href: adminPath("content/header"),
    label: "Meni i dugme u headeru",
    frontendHint: "Gornji meni · jezik · „Zakažite konsultaciju“",
    zone: "header",
    order: 1,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },

  {
    href: adminPath("content/home"),
    label: "Pregled početne",
    frontendHint: "Mapa svih sekcija — redoslijed na sajtu",
    zone: "home",
    order: 0,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
  {
    href: adminPath("content/hero"),
    label: "① Hero",
    frontendHint: "Vrh početne — naslov, video, dugmad",
    zone: "home",
    order: 1,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
  {
    href: adminPath("content/process"),
    label: "② Kako radimo",
    frontendHint: "Četiri koraka ispod heroa",
    zone: "home",
    order: 2,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
  {
    href: adminPath("content/showcase"),
    label: "③ Video klipovi",
    frontendHint: "Tri video trake jedna ispod druge",
    zone: "home",
    order: 3,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
  {
    href: adminPath("content/design3d"),
    label: "④ 3D prije / poslije",
    frontendHint: "Slider sa dve slike",
    zone: "home",
    order: 4,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
  {
    href: adminPath("content/about"),
    label: "⑤ O nama",
    frontendHint: "Tekst i fotografija dizajnera",
    zone: "home",
    order: 5,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
  {
    href: adminPath("content/home-cards"),
    label: "⑥ Portfolio projekti",
    frontendHint: "Kartice projekata + naslov sekcije",
    zone: "home",
    order: 6,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
  {
    href: adminPath("content/consult"),
    label: "⑦ Kontakt forma",
    frontendHint: "Sekcija sa formom na početnoj",
    zone: "home",
    order: 7,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
  {
    href: adminPath("content/team"),
    label: "⑧ Testimonijali",
    frontendHint: "Citati klijenata ispod forme",
    zone: "home",
    order: 8,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },

  {
    href: adminPath("content/header-footer"),
    label: "Footer i kontakt",
    frontendHint: "Podnožje na svim stranicama",
    zone: "footer",
    order: 1,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },

  {
    href: adminPath("posts"),
    label: "Lista članaka",
    frontendHint: "Blog / novosti",
    zone: "blog",
    order: 1,
    anyPermission: [
      PERMISSIONS.SITE_CONTENT_MANAGE,
      PERMISSIONS.ASSIGNED_CONTENT_MANAGE,
    ],
  },
  {
    href: adminPath("posts/new"),
    label: "Novi članak",
    frontendHint: "Objava na blogu",
    zone: "blog",
    order: 2,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
  {
    href: adminPath("content/blog-headings"),
    label: "Naslovi blog sekcije",
    frontendHint: "Tekst iznad liste članaka na početnoj",
    zone: "blog",
    order: 3,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },

  {
    href: adminPath("media"),
    label: "Galerija slika i video",
    frontendHint: "Upload — birate u formama",
    zone: "media",
    order: 1,
    anyPermission: [PERMISSIONS.MEDIA_MANAGE],
  },

  {
    href: adminPath("pages"),
    label: "Statičke stranice",
    frontendHint: "/s/naziv — politika, uslovi…",
    zone: "system",
    order: 1,
    anyPermission: [
      PERMISSIONS.SITE_CONTENT_MANAGE,
      PERMISSIONS.ASSIGNED_CONTENT_MANAGE,
    ],
  },
  {
    href: adminPath("translate"),
    label: "Prevodi ME → EN",
    frontendHint: "Automatski prevod tekstova",
    zone: "system",
    order: 2,
    anyPermission: [PERMISSIONS.SITE_CONTENT_MANAGE],
  },
];

export const ADMIN_ZONE_META: Record<
  AdminNavZone,
  { title: string; description: string }
> = {
  header: {
    title: "Header",
    description: "Navigacija i dugme u gornjoj traci",
  },
  home: {
    title: "Početna strana",
    description: "Sekcije redom ①–⑧ — kao na /me",
  },
  footer: {
    title: "Footer",
    description: "Podnožje, kontakt i društvene mreže",
  },
  blog: {
    title: "Blog",
    description: "Članci i naslovi sekcije novosti",
  },
  media: {
    title: "Mediji",
    description: "Slike i video za cijeli sajt",
  },
  system: {
    title: "Ostalo",
    description: "Statičke stranice i prevodi",
  },
};

export function linksForZone(
  zone: AdminNavZone,
  can: (p: Permission) => boolean,
): AdminContentLink[] {
  return ADMIN_CONTENT_LINKS.filter((l) => {
    if (l.zone !== zone) return false;
    if (!l.anyPermission?.length) return true;
    return l.anyPermission.some((p) => can(p));
  }).sort((a, b) => a.order - b.order);
}

export function frontendHintForAdminPath(relativePath: string): string | undefined {
  const href = adminPath(relativePath);
  return ADMIN_CONTENT_LINKS.find((l) => l.href === href)?.frontendHint;
}

/** Admin rute za revalidaciju nakon izmjene sadržaja. */
export const ADMIN_CONTENT_REVALIDATE_PATHS = [
  "/admin",
  "/admin/content/header",
  "/admin/content/header-footer",
  "/admin/content/hero",
  "/admin/content/home",
  "/admin/content/process",
  "/admin/content/showcase",
  "/admin/content/design3d",
  "/admin/content/about",
  "/admin/content/home-cards",
  "/admin/content/consult",
  "/admin/content/team",
  "/admin/content/blog-headings",
  "/admin/media",
  "/admin/settings",
  "/admin/site",
] as const;

export function isAdminContentPathActive(pathname: string, href: string): boolean {
  if (href === adminPath("pages")) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  if (href === adminPath("content/header")) {
    return pathname === href;
  }
  if (href === adminPath("content/home")) {
    return pathname === href;
  }
  if (href === adminPath("posts")) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  if (href === adminPath("media")) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  if (href === adminPath()) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
