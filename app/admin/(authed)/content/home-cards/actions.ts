"use server";



import { randomUUID } from "crypto";

import { and, asc, eq, gt, lt, sql } from "drizzle-orm";

import { revalidatePath } from "next/cache";



import { getSession } from "@/lib/auth";

import { canManageAllSiteContent } from "@/lib/auth/content-access";

import { db } from "@/lib/db";

import { homeServiceCards, homeServiceCardTranslations } from "@/lib/db/schema";

import type { Locale } from "@/lib/i18n";

import { activeLocales, locales } from "@/lib/i18n";

import { projectPagePath, sanitizeProjectSlug } from "@/lib/project-path";

import {

  isProjectSlugTaken,

  upsertCardTranslation,

} from "@/lib/queries/home-service-cards";

import { revalidatePublicSite } from "@/lib/revalidate-content";



const ALLOWED_ICONS = [

  "heart", "home", "baby", "flask-conical", "activity", "scan", "stethoscope",

  "microscope", "test-tube", "dna", "gift", "shield", "star",

  "users", "zap", "sun", "leaf",

];



function revalidateAll(slug?: string | null) {

  revalidatePublicSite();

  revalidatePath("/admin/content/home-cards");

  if (slug?.trim()) {

    for (const loc of locales) {

      revalidatePath(`/${loc}/projekti/${slug.trim().toLowerCase()}`);

    }

  }

}



/** Spremi izmjenu jedne kartice (slug, href, icon, visible + prevodi po jezicima). */

export async function saveCardAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {

  const session = await getSession();

  if (!session || !canManageAllSiteContent(session.role)) {

    return { ok: false, error: "Nedovoljne privilegije." };

  }



  const cardId = String(formData.get("cardId") ?? "").trim();

  if (!cardId) return { ok: false, error: "Nedostaje ID kartice." };



  const slugRaw = String(formData.get("slug") ?? "").trim();

  const slug = slugRaw ? sanitizeProjectSlug(slugRaw) : null;

  if (slugRaw && !slug) {

    return { ok: false, error: "Slug nije ispravan (koristite slova, brojeve i crtice)." };

  }

  if (slug && (await isProjectSlugTaken(slug, cardId))) {

    return { ok: false, error: "Slug je već zauzet drugim projektom." };

  }



  const hrefFallback = String(formData.get("href") ?? "").trim() || "#";

  const href = slug ? projectPagePath(slug) : hrefFallback.slice(0, 512);

  const iconName = String(formData.get("iconName") ?? "heart").trim();

  const validIcon = ALLOWED_ICONS.includes(iconName) ? iconName : "heart";

  const visible = formData.get("visible") === "1";

  const coverRaw = String(formData.get("coverImageUrl") ?? "").trim();

  const coverImageUrl = coverRaw ? coverRaw.slice(0, 512) : null;



  await db

    .update(homeServiceCards)

    .set({

      slug,

      href,

      iconName: validIcon,

      coverImageUrl,

      visible,

      updatedAt: new Date(),

    })

    .where(eq(homeServiceCards.id, cardId));



  for (const loc of activeLocales) {

    const title = String(formData.get(`title_${loc}`) ?? "").trim();

    const description = String(formData.get(`description_${loc}`) ?? "").trim() || null;

    const body = String(formData.get(`body_${loc}`) ?? "").trim() || null;

    await upsertCardTranslation(cardId, loc as Locale, title, description, body);

  }



  revalidateAll(slug);

  return { ok: true };

}



/** Dodaj novu karticu na kraj liste. */

export async function addCardAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {

  const session = await getSession();

  if (!session || !canManageAllSiteContent(session.role)) {

    return { ok: false, error: "Nedovoljne privilegije." };

  }



  const [maxRow] = await db

    .select({ maxSort: sql<number>`MAX(sort_order)` })

    .from(homeServiceCards);

  const nextSort = ((maxRow?.maxSort ?? 0) as number) + 1;



  const cardId = randomUUID();

  const now = new Date();

  const titleMe = String(formData.get("title_me") ?? "Nova kartica").trim() || "Nova kartica";

  const baseSlug = sanitizeProjectSlug(titleMe) ?? `projekat-${cardId.slice(0, 8)}`;

  let slug = baseSlug;

  let n = 2;

  while (await isProjectSlugTaken(slug)) {

    slug = `${baseSlug}-${n}`;

    n += 1;

  }



  await db.insert(homeServiceCards).values({

    id: cardId,

    sortOrder: nextSort,

    iconName: "heart",

    slug,

    href: projectPagePath(slug),

    visible: true,

    updatedAt: now,

  });



  for (const loc of locales) {

    const title = loc === "me" ? titleMe : titleMe;

    await db.insert(homeServiceCardTranslations).values({

      id: randomUUID(),

      cardId,

      locale: loc as Locale,

      title,

      description: null,

      body: null,

    });

  }



  revalidateAll(slug);

  return { ok: true };

}



/** Obriši karticu. */

export async function deleteCardAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {

  const session = await getSession();

  if (!session || !canManageAllSiteContent(session.role)) {

    return { ok: false, error: "Nedovoljne privilegije." };

  }



  const cardId = String(formData.get("cardId") ?? "").trim();

  if (!cardId) return { ok: false, error: "Nedostaje ID." };



  const [row] = await db

    .select({ slug: homeServiceCards.slug })

    .from(homeServiceCards)

    .where(eq(homeServiceCards.id, cardId))

    .limit(1);



  await db.delete(homeServiceCards).where(eq(homeServiceCards.id, cardId));

  revalidateAll(row?.slug);

  return { ok: true };

}



/** Pomjeri karticu gore ili dolje (zamijeni sort_order sa susjedom). */

export async function moveCardAction(formData: FormData): Promise<void> {

  const session = await getSession();

  if (!session || !canManageAllSiteContent(session.role)) return;



  const cardId = String(formData.get("cardId") ?? "").trim();

  const direction = String(formData.get("direction") ?? "") as "up" | "down";

  if (!cardId || (direction !== "up" && direction !== "down")) return;



  const [current] = await db

    .select({ id: homeServiceCards.id, sortOrder: homeServiceCards.sortOrder })

    .from(homeServiceCards)

    .where(eq(homeServiceCards.id, cardId))

    .limit(1);

  if (!current) return;



  const neighbor = direction === "up"

    ? await db

        .select({ id: homeServiceCards.id, sortOrder: homeServiceCards.sortOrder })

        .from(homeServiceCards)

        .where(lt(homeServiceCards.sortOrder, current.sortOrder))

        .orderBy(sql`sort_order DESC`)

        .limit(1)

    : await db

        .select({ id: homeServiceCards.id, sortOrder: homeServiceCards.sortOrder })

        .from(homeServiceCards)

        .where(gt(homeServiceCards.sortOrder, current.sortOrder))

        .orderBy(asc(homeServiceCards.sortOrder))

        .limit(1);



  const [nbr] = neighbor;

  if (!nbr) return;



  await db.update(homeServiceCards).set({ sortOrder: nbr.sortOrder }).where(eq(homeServiceCards.id, current.id));

  await db.update(homeServiceCards).set({ sortOrder: current.sortOrder }).where(eq(homeServiceCards.id, nbr.id));



  revalidateAll();

}


