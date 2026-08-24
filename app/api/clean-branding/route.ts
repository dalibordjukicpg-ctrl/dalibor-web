import { db } from "@/lib/db";
import { siteLocaleStrings, siteGlobals } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: string[] = [];

  const updates: Record<string, string> = {
    "org.brand": "",
    "footer.copyright": "Sva prava zadržana.",
    "footer.site_domain_label": "",
    "footer.site_domain_href": "",
    "contact.email": "",
  };

  for (const [key, val] of Object.entries(updates)) {
    await db
      .update(siteLocaleStrings)
      .set({ value: val })
      .where(sql`${siteLocaleStrings.fieldKey} = ${key}`);
    results.push(`${key} -> "${val}"`);
  }

  await db
    .update(siteLocaleStrings)
    .set({ value: "" })
    .where(
      sql`(${siteLocaleStrings.value} LIKE '%Simple Solutioning%' OR ${siteLocaleStrings.value} LIKE '%simplesolutioning%' OR ${siteLocaleStrings.value} LIKE '%Sanja%' OR ${siteLocaleStrings.value} LIKE '%Subacev%' OR ${siteLocaleStrings.value} LIKE '%subacev%')`
    );
  results.push("Cleared any remaining old branding values");

  await db
    .update(siteGlobals)
    .set({ logoMediaId: null })
    .where(sql`logo_media_id IS NOT NULL`);
  results.push("Cleared logo_media_id");

  return NextResponse.json({ ok: true, results });
}
