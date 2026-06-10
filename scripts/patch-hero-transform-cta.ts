import "./load-dotenv";

import { randomUUID } from "crypto";

import { and, eq } from "drizzle-orm";

import { db } from "../lib/db";
import { siteLocaleStrings } from "../lib/db/schema";
import type { Locale } from "../lib/i18n";
import { SITE_STRING_DEFAULTS, type SiteStringKey } from "../lib/site-fields";

const PATCH_KEYS = [
  "hero.line1",
  "hero.line2",
  "hero.cta_primary",
  "hero.cta_primary_href",
  "header.cta_book",
  "header.cta_book_href",
  "showcase.v1.title",
  "showcase.v2.title",
  "showcase.v3.title",
  "org.brand",
  "footer.copyright",
  "footer.site_domain_label",
  "footer.site_domain_href",
  "contact.email",
  "design3d.title",
  "design3d.subtitle",
  "design3d.cta",
  "design3d.cta_href",
] as const satisfies readonly SiteStringKey[];

const LOCALES: Locale[] = ["me", "en"];

async function upsertString(
  key: SiteStringKey,
  locale: Locale,
  value: string,
): Promise<void> {
  const [existing] = await db
    .select({ id: siteLocaleStrings.id })
    .from(siteLocaleStrings)
    .where(
      and(eq(siteLocaleStrings.fieldKey, key), eq(siteLocaleStrings.locale, locale)),
    )
    .limit(1);

  const now = new Date();
  if (existing) {
    await db
      .update(siteLocaleStrings)
      .set({ value, updatedAt: now })
      .where(eq(siteLocaleStrings.id, existing.id));
    console.log(`  updated ${locale} ${key}`);
    return;
  }

  await db.insert(siteLocaleStrings).values({
    id: randomUUID(),
    fieldKey: key,
    locale,
    value,
    updatedAt: now,
  });
  console.log(`  inserted ${locale} ${key}`);
}

async function main(): Promise<void> {
  console.log("Patch hero CTA → /transform-prostor");
  for (const locale of LOCALES) {
    for (const key of PATCH_KEYS) {
      const value = SITE_STRING_DEFAULTS[locale][key];
      await upsertString(key, locale, value);
    }
  }
  console.log("Gotovo.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
