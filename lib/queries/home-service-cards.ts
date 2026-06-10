import { and, asc, eq, ne } from "drizzle-orm";



import { db } from "@/lib/db";

import { homeServiceCards, homeServiceCardTranslations } from "@/lib/db/schema";

import type { Locale } from "@/lib/i18n";

import { defaultLocale, locales } from "@/lib/i18n";

import { projectPagePath } from "@/lib/project-path";



export type HomeServiceCard = {

  id: string;

  sortOrder: number;

  iconName: string;

  href: string;

  slug: string | null;

  coverImageUrl: string | null;

  visible: boolean;

  title: string;

  description: string | null;

};



export type HomeServiceCardAdmin = {

  id: string;

  sortOrder: number;

  iconName: string;

  href: string;

  slug: string | null;

  coverImageUrl: string | null;

  visible: boolean;

  translations: Record<Locale, { title: string; description: string | null; body: string | null }>;

};



export type ProjectDetail = {

  id: string;

  slug: string;

  coverImageUrl: string | null;

  title: string;

  description: string | null;

  body: string | null;

};



/** Objavljene kartice za javni prikaz (vidljive, po sort_order). */

export async function listVisibleHomeServiceCards(

  locale: Locale,

): Promise<HomeServiceCard[]> {

  const rows = await db

    .select({

      id: homeServiceCards.id,

      sortOrder: homeServiceCards.sortOrder,

      iconName: homeServiceCards.iconName,

      href: homeServiceCards.href,

      slug: homeServiceCards.slug,

      coverImageUrl: homeServiceCards.coverImageUrl,

      visible: homeServiceCards.visible,

      locale: homeServiceCardTranslations.locale,

      title: homeServiceCardTranslations.title,

      description: homeServiceCardTranslations.description,

    })

    .from(homeServiceCards)

    .leftJoin(

      homeServiceCardTranslations,

      eq(homeServiceCardTranslations.cardId, homeServiceCards.id),

    )

    .where(eq(homeServiceCards.visible, true))

    .orderBy(asc(homeServiceCards.sortOrder));



  const byId = new Map<

    string,

    {

      base: Omit<HomeServiceCard, "title" | "description">;

      trans: Map<string, { title: string; description: string | null }>;

    }

  >();

  for (const r of rows) {

    if (!byId.has(r.id)) {

      byId.set(r.id, {

        base: {

          id: r.id,

          sortOrder: r.sortOrder,

          iconName: r.iconName,

          href: r.href,

          slug: r.slug ?? null,

          coverImageUrl: r.coverImageUrl ?? null,

          visible: r.visible,

        },

        trans: new Map(),

      });

    }

    if (r.locale) {

      byId.get(r.id)!.trans.set(r.locale, { title: r.title ?? "", description: r.description ?? null });

    }

  }



  return Array.from(byId.values()).map(({ base, trans }) => {

    const t = trans.get(locale) ?? trans.get(defaultLocale) ?? { title: "", description: null };

    return { ...base, title: t.title, description: t.description };

  });

}



/** Javna stranica projekta po slug-u. */

export async function getProjectBySlug(

  locale: Locale,

  slug: string,

): Promise<ProjectDetail | null> {

  const normalized = slug.trim().toLowerCase();

  if (!normalized) return null;



  const rows = await db

    .select({

      id: homeServiceCards.id,

      slug: homeServiceCards.slug,

      coverImageUrl: homeServiceCards.coverImageUrl,

      visible: homeServiceCards.visible,

      locale: homeServiceCardTranslations.locale,

      title: homeServiceCardTranslations.title,

      description: homeServiceCardTranslations.description,

      body: homeServiceCardTranslations.body,

    })

    .from(homeServiceCards)

    .leftJoin(

      homeServiceCardTranslations,

      eq(homeServiceCardTranslations.cardId, homeServiceCards.id),

    )

    .where(and(eq(homeServiceCards.slug, normalized), eq(homeServiceCards.visible, true)))

    .limit(4);



  if (rows.length === 0) return null;



  const base = rows[0]!;

  if (!base.slug) return null;



  const trans = new Map<string, { title: string; description: string | null; body: string | null }>();

  for (const r of rows) {

    if (r.locale) {

      trans.set(r.locale, {

        title: r.title ?? "",

        description: r.description ?? null,

        body: r.body ?? null,

      });

    }

  }



  const t =

    trans.get(locale) ??

    trans.get(defaultLocale) ??

    { title: "", description: null, body: null };



  return {

    id: base.id,

    slug: base.slug,

    coverImageUrl: base.coverImageUrl ?? null,

    title: t.title,

    description: t.description,

    body: t.body,

  };

}



/** Sve kartice za admin (uključujući nevidljive), sa svim prevodima. */

export async function listHomeServiceCardsAdmin(): Promise<HomeServiceCardAdmin[]> {

  const rows = await db

    .select({

      id: homeServiceCards.id,

      sortOrder: homeServiceCards.sortOrder,

      iconName: homeServiceCards.iconName,

      href: homeServiceCards.href,

      slug: homeServiceCards.slug,

      coverImageUrl: homeServiceCards.coverImageUrl,

      visible: homeServiceCards.visible,

      locale: homeServiceCardTranslations.locale,

      title: homeServiceCardTranslations.title,

      description: homeServiceCardTranslations.description,

      body: homeServiceCardTranslations.body,

    })

    .from(homeServiceCards)

    .leftJoin(

      homeServiceCardTranslations,

      eq(homeServiceCardTranslations.cardId, homeServiceCards.id),

    )

    .orderBy(asc(homeServiceCards.sortOrder));



  const byId = new Map<string, HomeServiceCardAdmin>();

  for (const r of rows) {

    if (!byId.has(r.id)) {

      const emptyTrans = Object.fromEntries(

        locales.map((l) => [l, { title: "", description: null, body: null }]),

      ) as Record<Locale, { title: string; description: string | null; body: string | null }>;

      byId.set(r.id, {

        id: r.id,

        sortOrder: r.sortOrder,

        iconName: r.iconName,

        href: r.href,

        slug: r.slug ?? null,

        coverImageUrl: r.coverImageUrl ?? null,

        visible: r.visible,

        translations: emptyTrans,

      });

    }

    if (r.locale) {

      const loc = r.locale as Locale;

      byId.get(r.id)!.translations[loc] = {

        title: r.title ?? "",

        description: r.description ?? null,

        body: r.body ?? null,

      };

    }

  }



  return Array.from(byId.values());

}



/** Provjera jedinstvenosti slug-a (isključuje trenutnu karticu). */

export async function isProjectSlugTaken(

  slug: string,

  excludeCardId?: string,

): Promise<boolean> {

  const normalized = slug.trim().toLowerCase();

  if (!normalized) return false;



  const conditions = [eq(homeServiceCards.slug, normalized)];

  if (excludeCardId) {

    conditions.push(ne(homeServiceCards.id, excludeCardId));

  }



  const [row] = await db

    .select({ id: homeServiceCards.id })

    .from(homeServiceCards)

    .where(and(...conditions))

    .limit(1);



  return Boolean(row);

}



/** Upsert prijevoda za karticu (insert ili update). */

export async function upsertCardTranslation(

  cardId: string,

  locale: Locale,

  title: string,

  description: string | null,

  body: string | null = null,

): Promise<void> {

  const { randomUUID } = await import("crypto");

  const [existing] = await db

    .select({ id: homeServiceCardTranslations.id })

    .from(homeServiceCardTranslations)

    .where(

      and(

        eq(homeServiceCardTranslations.cardId, cardId),

        eq(homeServiceCardTranslations.locale, locale),

      ),

    )

    .limit(1);



  if (existing) {

    await db

      .update(homeServiceCardTranslations)

      .set({

        title: title.slice(0, 500),

        description: description || null,

        body: body || null,

      })

      .where(eq(homeServiceCardTranslations.id, existing.id));

  } else {

    await db.insert(homeServiceCardTranslations).values({

      id: randomUUID(),

      cardId,

      locale,

      title: title.slice(0, 500),

      description: description || null,

      body: body || null,

    });

  }

}



/** Javni href kartice — stranica projekta ako postoji slug. */

export function resolveCardPublicHref(card: Pick<HomeServiceCard, "slug" | "href">): string {

  if (card.slug?.trim()) return projectPagePath(card.slug);

  return card.href;

}


