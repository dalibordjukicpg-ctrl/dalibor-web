import Link from "next/link";
import { notFound } from "next/navigation";

import { HomeBlogPreview } from "@/components/site/home-blog-preview";
import { PageHero } from "@/components/site/page-hero";
import { getDbConnectionUserMessage, isDbConnectionError } from "@/lib/db-errors";
import { isLocale } from "@/lib/i18n";
import { withCanonical } from "@/lib/page-metadata";
import { listPublishedSummaries } from "@/lib/queries/posts";
import { getSiteLayoutData } from "@/lib/queries/site";
import { SITE_STRING_DEFAULTS } from "@/lib/site-fields";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const title = "Blog";
  const description =
    raw === "en"
      ? "News and inspiration from the studio."
      : "Novosti i inspiracija iz studija.";
  return withCanonical(`/${raw}/blog`, { title, description });
}

export default async function BlogArchivePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  let s = SITE_STRING_DEFAULTS[raw];
  try {
    const data = await getSiteLayoutData(raw);
    s = data.s;
  } catch (e) {
    console.error("[BlogArchivePage getSiteLayoutData]", e);
  }

  let posts: Awaited<ReturnType<typeof listPublishedSummaries>> = [];
  let dbError: string | null = null;
  try {
    posts = await listPublishedSummaries(raw);
  } catch (e) {
    console.error(e);
    dbError = isDbConnectionError(e)
      ? getDbConnectionUserMessage(e)
      : raw === "en"
        ? "Could not load articles."
        : "Greška pri učitavanju članaka.";
  }

  const homeLabel = raw === "en" ? "Home" : "Početna";

  return (
    <main className="flex min-h-screen flex-col">
      <PageHero
        max="5xl"
        breadcrumbs={[
          { label: homeLabel, href: `/${raw}` },
          { label: "Blog", href: `/${raw}/blog` },
        ]}
      >
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-site-brand sm:text-[11px]">
          {s["home.news_eyebrow"]}
        </p>
        <h1
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          className="max-w-2xl text-[clamp(1.85rem,5vw,2.75rem)] font-light leading-[1.12] tracking-tight text-site-ink"
        >
          {s["section.news_title"]}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-site-muted sm:text-base">
          {raw === "en"
            ? "Projects, ideas and studio news."
            : "Projekti, ideje i novosti iz studija."}
        </p>
        <Link
          href={`/${raw}`}
          className="mt-6 inline-flex min-h-[44px] items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-site-brand transition hover:text-site-brand-accent"
        >
          ← {homeLabel}
        </Link>
      </PageHero>
      <HomeBlogPreview
        locale={raw}
        eyebrow={s["home.news_eyebrow"]}
        title={s["section.news_title"]}
        readLabel={s["home.news_read_label"]}
        archiveHref={`/${raw}/blog`}
        posts={posts}
        loadError={dbError}
        showArchiveLink={false}
      />
    </main>
  );
}
