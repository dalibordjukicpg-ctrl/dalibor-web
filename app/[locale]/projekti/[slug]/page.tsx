import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/site/page-hero";
import { CLINIC_PAGE_HERO_BG } from "@/lib/clinic-assets";
import { getDbConnectionUserMessage, isDbConnectionError } from "@/lib/db-errors";
import { isLocale, type Locale } from "@/lib/i18n";
import { withCanonical } from "@/lib/page-metadata";
import { splitProjectBody } from "@/lib/project-path";
import { getProjectBySlug } from "@/lib/queries/home-service-cards";
import { getHomeBreadcrumbLabel } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const COPY: Record<
  Locale,
  { projects: string; back: string; contact: string; contactHref: string }
> = {
  me: {
    projects: "Projekti",
    back: "← Nazad na projekte",
    contact: "Zatražite konsultaciju",
    contactHref: "#kontakt",
  },
  en: {
    projects: "Projects",
    back: "← Back to projects",
    contact: "Request a consultation",
    contactHref: "#kontakt",
  },
  ru: {
    projects: "Проекты",
    back: "← Назад к проектам",
    contact: "Запросить консультацию",
    contactHref: "#kontakt",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  try {
    const project = await getProjectBySlug(raw, slug);
    if (!project) return {};
    return withCanonical(`/${raw}/projekti/${slug}`, {
      title: project.title,
      description: project.description ?? undefined,
    });
  } catch {
    return { title: "Projekat" };
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();

  const copy = COPY[raw];
  let homeLabel = "Početna";
  try {
    homeLabel = await getHomeBreadcrumbLabel(raw);
  } catch {
    /* fallback */
  }

  let project: Awaited<ReturnType<typeof getProjectBySlug>>;
  try {
    project = await getProjectBySlug(raw, slug);
  } catch (e) {
    console.error(e);
    return (
      <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-transparent">
        <article className="mx-auto max-w-3xl px-6 py-10 lg:px-16">
          <Link
            href={`/${raw}`}
            className="text-[11px] font-medium uppercase tracking-[0.25em] text-site-brand hover:underline"
          >
            ← {homeLabel}
          </Link>
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {isDbConnectionError(e)
              ? getDbConnectionUserMessage(e)
              : "Greška pri učitavanju projekta."}
          </p>
        </article>
      </main>
    );
  }

  if (!project) notFound();

  const heroBg = project.coverImageUrl?.trim() || CLINIC_PAGE_HERO_BG;
  const paragraphs = splitProjectBody(project.body);
  const portfolioHref = `/${raw}#portfolio`;
  const contactHref = `/${raw}${copy.contactHref}`;

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-transparent">
      <PageHero
        backgroundImage={heroBg}
        breadcrumbs={[
          { label: homeLabel, href: `/${raw}` },
          { label: copy.projects, href: portfolioHref },
          { label: project.title, href: `/${raw}/projekti/${project.slug}` },
        ]}
      >
        <h1
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          className="max-w-[95vw] text-[clamp(1.85rem,6.5vw,3.5rem)] font-light leading-[1.08] tracking-tight text-zinc-900 [text-shadow:0_1px_24px_rgba(255,255,255,0.9),0_0_1px_rgba(255,255,255,0.95)] sm:max-w-none sm:leading-[1.05]"
        >
          {project.title}
        </h1>
        {project.description?.trim() ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-700 [text-shadow:0_1px_14px_rgba(255,255,255,0.85)]">
            {project.description}
          </p>
        ) : null}
        <div className="site-accent-bar mt-5 h-[2px] w-16 rounded-full sm:mt-6 sm:w-20" />
      </PageHero>

      <article className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16 lg:px-16">
        {project.coverImageUrl?.trim() ? (
          <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-2xl border border-site-border bg-site-surface-a shadow-site-lift sm:mb-12">
            {project.coverImageUrl.startsWith("/") ? (
              <Image
                src={project.coverImageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.coverImageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        ) : null}

        {paragraphs.length > 0 ? (
          <div className="space-y-5 text-[0.9375rem] leading-[1.75] text-site-muted sm:text-base">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        ) : (
          <p className="text-[0.9375rem] leading-relaxed text-site-muted">
            {project.description}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-site-border pt-10 sm:mt-12">
          <Link href={contactHref} className="site-btn-primary">
            {copy.contact}
          </Link>
          <Link
            href={portfolioHref}
            className="site-btn-ghost text-[11px] uppercase tracking-[0.2em]"
          >
            {copy.back}
          </Link>
        </div>
      </article>
    </main>
  );
}
