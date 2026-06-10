import { HomeAbout } from "@/components/site/home-about";
import { HomeDesign3d } from "@/components/site/home-design-3d";
import { HomeBlogPreview } from "@/components/site/home-blog-preview";
import { HomeConsultationCta } from "@/components/site/home-consultation-cta";
import { HomeHeroLandscape } from "@/components/site/home-hero-landscape";
import { HomePortfolio } from "@/components/site/home-portfolio";
import { HomeProcess } from "@/components/site/home-process";
import { HomeShowcaseVideos } from "@/components/site/home-showcase-videos";
import { HomeTestimonials } from "@/components/site/home-testimonials";
import type { HomeTeamHighlight } from "@/lib/queries/home-team-highlights";
import type { PostSummary } from "@/lib/queries/posts";
import type { Locale } from "@/lib/i18n";
import type { PublicNavItem } from "@/lib/queries/site";
import { resolvePublicHref } from "@/lib/queries/site";
import { resolveCardPublicHref, type HomeServiceCard } from "@/lib/queries/home-service-cards";
import {
  resolveHeroBackgroundUrl,
  resolveHeroVideoAssets,
} from "@/lib/fallback-hero-video";
import { HOME_SHOWCASE_CLIPS } from "@/lib/showcase-videos";
import type { SiteStringKey } from "@/lib/site-fields";

type Props = {
  locale: Locale;
  s: Record<SiteStringKey, string>;
  nav: PublicNavItem[];
  posts: PostSummary[];
  dbError: string | null;
  heroBgUrl?: string | null;
  aboutImageUrl?: string | null;
  serviceCards: HomeServiceCard[];
  teamHighlights: HomeTeamHighlight[];
};

function telFromDisplay(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return undefined;
  if (digits.startsWith("382")) return `tel:+${digits}`;
  return `tel:+382${digits.replace(/^0+/, "")}`;
}

export function HomePageView({
  locale,
  s,
  posts,
  dbError,
  heroBgUrl,
  aboutImageUrl,
  serviceCards,
  teamHighlights,
}: Props) {
  const heroMediaUrl = resolveHeroBackgroundUrl(heroBgUrl);
  const heroVideoAssets = resolveHeroVideoAssets(heroMediaUrl);

  const processSteps = [1, 2, 3, 4].map((n) => ({
    number: String(n).padStart(2, "0"),
    title: s[`process.step${n}.title` as SiteStringKey],
    description: s[`process.step${n}.body` as SiteStringKey],
  }));

  const portfolioProjects = serviceCards.map((card) => ({
    id: card.id,
    title: card.title,
    description: card.description,
    href: resolvePublicHref(locale, resolveCardPublicHref(card)),
    imageUrl: card.coverImageUrl,
  }));

  const testimonials =
    teamHighlights.length > 0
      ? teamHighlights.map((h) => ({
          id: h.id,
          name: h.title,
          quote: h.teaser ?? "",
        }))
      : [1, 2, 3]
          .map((n) => ({
            id: `fallback-${n}`,
            name: s[`team.hl${n}.title` as SiteStringKey],
            quote: s[`team.hl${n}.body` as SiteStringKey],
          }))
          .filter((t) => t.name.trim() || t.quote.trim());

  const processCtaHref = resolvePublicHref(
    locale,
    s["process.cta_href"] || s["hero.cta_primary_href"],
  );
  const aboutCtaHref = resolvePublicHref(
    locale,
    s["about.cta_href"] || s["hero.cta_secondary_href"],
  );
  const consultCtaHref = resolvePublicHref(
    locale,
    s["consult.cta_href"] || s["header.cta_book_href"],
  );

  const portfolioCtaHref = resolvePublicHref(
    locale,
    s["portfolio.cta_href"] || s["hero.cta_secondary_href"],
  );

  return (
    <>
      {heroVideoAssets?.posterSrc ? (
        <link
          rel="preload"
          as="image"
          href={heroVideoAssets.posterSrc}
          fetchPriority="high"
        />
      ) : null}
      {heroVideoAssets?.mobileSrc ? (
        <link
          rel="preload"
          as="video"
          href={heroVideoAssets.mobileSrc}
          fetchPriority="high"
          media="(max-width: 767px)"
        />
      ) : heroVideoAssets?.src ? (
        <link rel="preload" as="video" href={heroVideoAssets.src} fetchPriority="high" />
      ) : null}

      <HomeHeroLandscape
        eyebrow={s["org.brand"].toUpperCase()}
        headingLine1={s["hero.line1"]}
        headingLine2={s["hero.line2"]}
        subheading={s["hero.subtitle"]}
        primaryCta={{
          label: s["hero.cta_primary"],
          href: resolvePublicHref(locale, s["hero.cta_primary_href"]),
        }}
        secondaryCta={{
          label: s["hero.cta_secondary"],
          href: resolvePublicHref(locale, s["hero.cta_secondary_href"]),
        }}
        mediaUrl={heroMediaUrl}
        videoAssets={heroVideoAssets}
      />

      <HomeProcess
        eyebrow={s["process.eyebrow"]}
        title={s["process.title"]}
        steps={processSteps}
        ctaLabel={s["process.cta"]}
        ctaHref={processCtaHref}
      />

      <HomeShowcaseVideos
        items={HOME_SHOWCASE_CLIPS.map((clip, index) => ({
          id: clip.id,
          src: clip.src,
          poster: clip.poster,
          title: s[`showcase.v${index + 1}.title` as SiteStringKey],
        }))}
        ctaTitle={s["showcase.cta_title"]}
        ctaLabel={s["showcase.cta_label"]}
        ctaHref={resolvePublicHref(locale, s["showcase.cta_href"])}
      />

      <HomeDesign3d
        title={s["design3d.title"]}
        subtitle={s["design3d.subtitle"]}
        ctaLabel={s["design3d.cta"]}
        ctaHref={resolvePublicHref(locale, s["design3d.cta_href"])}
      />

      <HomePortfolio
        eyebrow={s["section.services_subtitle"]}
        title={s["section.services_title"]}
        ctaLabel={s["portfolio.cta_label"] || s["hero.cta_secondary"]}
        ctaHref={portfolioCtaHref}
        projects={portfolioProjects}
      />

      <HomeAbout
        eyebrow={s["about.eyebrow"]}
        title={s["about.title"]}
        body={s["about.body"]}
        ctaLabel={s["about.cta"]}
        ctaHref={aboutCtaHref}
        imageUrl={aboutImageUrl}
        imageAlt={s["about.eyebrow"]}
      />

      <HomeConsultationCta
        locale={locale}
        privacyHref={resolvePublicHref(locale, s["footer.privacy_href"])}
        eyebrow={s["consult.eyebrow"]}
        title={s["consult.title"]}
        subtitle={s["consult.subtitle"]}
        ctaLabel={s["consult.cta"] || s["header.cta_book"]}
        ctaHref={consultCtaHref}
        callDisplay={s["contact.phone1"]}
        callHref={telFromDisplay(s["contact.phone1"])}
        emailDisplay={s["contact.email"]}
        emailHref={`mailto:${s["contact.email"].trim()}`}
      />

      <HomeTestimonials
        title={s["team.title"]}
        items={testimonials.filter((t) => t.quote.trim())}
      />

      <HomeBlogPreview
        locale={locale}
        eyebrow={s["home.news_eyebrow"]}
        title={s["section.news_title"]}
        readLabel={s["home.news_read_label"]}
        archiveHref={`/${locale}#novosti`}
        posts={dbError ? [] : posts}
        loadError={dbError}
      />
    </>
  );
}
