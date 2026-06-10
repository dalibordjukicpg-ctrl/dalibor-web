import Link from "next/link";
import { notFound } from "next/navigation";

import { DesignInquiryForm } from "@/components/forms/design-inquiry-form";
import { getDesignInquiryCopy } from "@/lib/design-inquiry-copy";
import { isLocale } from "@/lib/i18n";
import { withCanonical } from "@/lib/page-metadata";
import { getSiteLayoutData } from "@/lib/queries/site";
import { resolvePublicHref } from "@/lib/resolve-public-href";
import { SITE_STRING_DEFAULTS } from "@/lib/site-fields";

export const dynamic = "force-dynamic";

const HERO_BG = "/inquiry/lumion-landscape-hero.jpg";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getDesignInquiryCopy(raw);
  return withCanonical(`/${raw}/transform-prostor`, {
    title: copy.breadcrumbCurrent,
    description: copy.pageIntro.slice(0, 160),
  });
}

export default async function TransformSpacePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  let privacyHref = resolvePublicHref(raw, SITE_STRING_DEFAULTS[raw]["footer.privacy_href"]);
  try {
    const data = await getSiteLayoutData(raw);
    privacyHref = resolvePublicHref(raw, data.s["footer.privacy_href"]);
  } catch (e) {
    console.error("[TransformSpacePage getSiteLayoutData]", e);
  }

  const copy = getDesignInquiryCopy(raw);

  return (
    <main className="flex min-h-screen flex-col bg-site-canvas">
      <section
        className="relative isolate min-h-[min(48vh,520px)] w-full bg-cover bg-[center_42%] bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-site-canvas"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-10 pt-8 text-center sm:px-10 sm:pb-14 sm:pt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/90 sm:text-[11px]">
            {copy.banner}
          </p>
          <nav
            aria-label="Putanja"
            className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75"
          >
            <Link href={`/${raw}`} className="transition hover:text-white">
              {copy.breadcrumbHome}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{copy.breadcrumbCurrent}</span>
          </nav>
        </div>
      </section>

      <section className="relative z-10 -mt-6 flex-1 px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-2xl rounded-sm border border-site-border bg-site-card px-5 py-10 shadow-site-card-lg sm:px-8 sm:py-12 lg:px-10">
          <header className="mb-8 text-center sm:mb-10">
            <h1
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              className="text-[clamp(1.75rem,4vw,2.65rem)] font-light leading-[1.15] tracking-tight text-site-ink"
            >
              {copy.pageTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-site-muted sm:text-[0.9375rem]">
              {copy.pageIntro}
            </p>
          </header>

          <DesignInquiryForm locale={raw} privacyHref={privacyHref} />
        </div>
      </section>
    </main>
  );
}
