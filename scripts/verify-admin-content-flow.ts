/**
 * Provjera da admin izmjene (tekst, slike) stižu do javnog sajta.
 * Pokretanje: npm run verify:admin-flow
 */
import "./load-dotenv";

import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

import { ADMIN_BASE_PATH } from "../lib/admin-base-path";
import { db } from "../lib/db";
import { media, siteGlobals, siteLocaleStrings, users } from "../lib/db/schema";
import { FALLBACK_HERO_IMAGE_REL } from "../lib/clinic-assets";
import { resolveHeroBackgroundUrl } from "../lib/fallback-hero-video";
import { publicUrlFromMediaStorageKey } from "../lib/media-public";
import { getSiteBranding, getSiteGlobalsRow } from "../lib/queries/site-globals";
import { getSiteStringsMap, mergeSiteStrings } from "../lib/queries/site";
import { SITE_STRING_DEFAULTS } from "../lib/site-fields";

const BASE = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:7392";
const TEST_KEY = "process.eyebrow" as const;
const MARKER = `__ADMIN_TEST_${Date.now()}__`;

type Check = { name: string; ok: boolean; detail: string };

const checks: Check[] = [];

function record(name: string, ok: boolean, detail: string): void {
  checks.push({ name, ok, detail });
  const icon = ok ? "OK" : "FAIL";
  console.log(`[${icon}] ${name}: ${detail}`);
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} za ${url}`);
  return res.text();
}

async function readStringFromDb(locale: "me", key: typeof TEST_KEY): Promise<string | null> {
  const [row] = await db
    .select({ value: siteLocaleStrings.value })
    .from(siteLocaleStrings)
    .where(
      and(eq(siteLocaleStrings.locale, locale), eq(siteLocaleStrings.fieldKey, key)),
    )
    .limit(1);
  return row?.value ?? null;
}

async function upsertString(locale: "me", key: typeof TEST_KEY, value: string): Promise<void> {
  const [existing] = await db
    .select({ id: siteLocaleStrings.id })
    .from(siteLocaleStrings)
    .where(
      and(eq(siteLocaleStrings.locale, locale), eq(siteLocaleStrings.fieldKey, key)),
    )
    .limit(1);

  const now = new Date();
  if (existing) {
    await db
      .update(siteLocaleStrings)
      .set({ value, updatedAt: now })
      .where(eq(siteLocaleStrings.id, existing.id));
    return;
  }

  await db.insert(siteLocaleStrings).values({
    id: randomUUID(),
    fieldKey: key,
    locale,
    value,
    updatedAt: now,
  });
}

async function main(): Promise<void> {
  console.log("=== Provjera admin → javni sajt ===\n");

  // 1. Baza
  try {
    await db.select({ id: users.id }).from(users).limit(1);
    record("Baza (MySQL)", true, "Konekcija radi");
  } catch (e) {
    record("Baza (MySQL)", false, String(e));
    process.exit(1);
  }

  // 2. Admin korisnik
  const seedEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  if (seedEmail) {
    const [admin] = await db
      .select({
        id: users.id,
        role: users.role,
        emailVerifiedAt: users.emailVerifiedAt,
      })
      .from(users)
      .where(eq(users.email, seedEmail))
      .limit(1);
    record(
      "Admin korisnik",
      Boolean(admin),
      admin
        ? `${seedEmail} (${admin.role}, verified=${admin.emailVerifiedAt ? "da" : "ne"})`
        : `Nema korisnika ${seedEmail} — pokreni npm run seed:admin`,
    );
  } else {
    record("Admin korisnik", false, "SEED_ADMIN_EMAIL nije u .env");
  }

  // 3. Admin login stranica
  try {
    const loginUrl = `${BASE}${ADMIN_BASE_PATH}/login`;
    const html = await fetchText(loginUrl);
    const hasForm = html.includes('type="password"') || html.includes("password");
    record("Admin login stranica", hasForm, loginUrl);
  } catch (e) {
    record("Admin login stranica", false, String(e));
  }

  // 4. Zaštićena admin ruta (bez sesije → redirect/login)
  try {
    const heroAdmin = `${BASE}${ADMIN_BASE_PATH}/content/hero`;
    const res = await fetch(heroAdmin, { redirect: "manual", cache: "no-store" });
    const ok = res.status === 307 || res.status === 302 || res.status === 303;
    record(
      "Admin zaštita (hero)",
      ok,
      `${heroAdmin} → HTTP ${res.status} (očekivano 302/307 bez prijave)`,
    );
  } catch (e) {
    record("Admin zaštita (hero)", false, String(e));
  }

  // 5. Tekst: simuliraj admin save → provjeri query + javni HTML
  const original = await readStringFromDb("me", TEST_KEY);
  const baseline =
    original?.trim() ||
    SITE_STRING_DEFAULTS.me[TEST_KEY] ||
    "Kako radimo";

  const testValue = `${baseline} ${MARKER}`;

  try {
    await upsertString("me", TEST_KEY, testValue);

    const map = await getSiteStringsMap("me");
    const merged = mergeSiteStrings("me", map);
    const fromQuery = merged[TEST_KEY];
    record(
      "Tekst u query sloju",
      fromQuery.includes(MARKER),
      `process.eyebrow = "${fromQuery.slice(0, 80)}${fromQuery.length > 80 ? "…" : ""}"`,
    );

    const homeHtml = await fetchText(`${BASE}/me`);
    const onHome = homeHtml.includes(MARKER);
    record(
      "Tekst na javnoj početnoj",
      onHome,
      onHome
        ? "Marker vidljiv na /me nakon DB izmjene"
        : "Marker NIJE na /me — provjeri keš ili da li sekcija koristi taj ključ",
    );

    await upsertString("me", TEST_KEY, baseline);
    const revertedHtml = await fetchText(`${BASE}/me`);
    const reverted = !revertedHtml.includes(MARKER);
    record(
      "Vraćanje teksta",
      reverted,
      reverted ? "Marker uklonjen sa /me" : "Marker još uvijek na stranici",
    );
  } catch (e) {
    record("Tekst admin → sajt", false, String(e));
    try {
      await upsertString("me", TEST_KEY, baseline);
    } catch {
      /* ignore */
    }
  }

  // 6. site_globals + mediji (slike)
  try {
    const globals = await getSiteGlobalsRow();
    record(
      "site_globals red",
      Boolean(globals),
      globals ? `id=${globals.id}` : "Nema reda — pokreni migracije/seed",
    );

    const branding = await getSiteBranding();
    const hasLogo = Boolean(branding.logoUrl?.trim());
    const resolvedHero = resolveHeroBackgroundUrl(branding.heroBgUrl);
    const hasHero = Boolean(resolvedHero?.trim());
    record(
      "Logo URL (javni)",
      hasLogo,
      branding.logoUrl || "nije postavljen u site_globals",
    );
    record(
      "Hero pozadina (CMS ili fallback)",
      hasHero,
      resolvedHero
        ? globals?.heroBgMediaId || globals?.heroBgExternalUrl
          ? `iz CMS-a: ${resolvedHero.slice(0, 90)}`
          : `fallback: ${resolvedHero}`
        : "nema CMS ni fallback — postavi u Hero adminu",
    );

    if (globals?.logoMediaId) {
      const [logoMedia] = await db
        .select({ storageKey: media.storageKey })
        .from(media)
        .where(eq(media.id, globals.logoMediaId))
        .limit(1);
      if (logoMedia?.storageKey) {
        const rel = publicUrlFromMediaStorageKey(logoMedia.storageKey);
        const logoUrl = `${BASE}${rel}`;
        const headRes = await fetch(logoUrl, { method: "HEAD", cache: "no-store" });
        record(
          "Logo fajl dostupan",
          headRes.ok,
          `${logoUrl} → HTTP ${headRes.status}`,
        );
      }
    }

    const mediaCount = await db.select({ id: media.id }).from(media).limit(5);
    record(
      "Media biblioteka",
      mediaCount.length > 0,
      `${mediaCount.length > 0 ? "Ima" : "Nema"} zapisa u tabeli media`,
    );
  } catch (e) {
    record("Slike / globals", false, String(e));
  }

  // 7. Upload API bez sesije
  try {
    const res = await fetch(`${BASE}/api/admin/media/upload`, { method: "POST" });
    record(
      "Upload API zaštita",
      res.status === 401,
      `Bez prijave → HTTP ${res.status} (očekivano 401)`,
    );
  } catch (e) {
    record("Upload API zaštita", false, String(e));
  }

  console.log("\n=== Sažetak ===");
  const failed = checks.filter((c) => !c.ok);
  if (failed.length === 0) {
    console.log("Sve provjere prošle. Admin → javni sajt tok radi.");
    process.exit(0);
  }

  console.log(`${failed.length} provjera nije prošlo:`);
  for (const f of failed) {
    console.log(`  - ${f.name}: ${f.detail}`);
  }
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
