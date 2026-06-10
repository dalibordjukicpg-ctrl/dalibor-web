import Link from "next/link";

import { BeforeAfterSlider } from "@/components/site/before-after-slider";
import { FadeIn } from "@/components/site/fade-in";
import { HOME_BEFORE_AFTER } from "@/lib/before-after-images";

type Props = {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  beforeAlt?: string;
  afterAlt?: string;
};

export function HomeDesign3d({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  beforeAlt = "3D koncept — prije",
  afterAlt = "Realistična vizualizacija — poslije",
}: Props) {
  if (!title.trim()) return null;

  return (
    <section
      id="3d-dizajn"
      className="site-section scroll-mt-header relative z-10 overflow-x-hidden bg-site-surface-a py-section-y"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-16">
        <FadeIn className="text-center">
          <h2
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            className="text-[clamp(1.65rem,3.2vw,2.35rem)] font-light leading-tight tracking-tight text-site-ink"
          >
            {title}
          </h2>
        </FadeIn>

        <FadeIn className="mt-8 sm:mt-10" delay={120}>
          <BeforeAfterSlider
            beforeSrc={HOME_BEFORE_AFTER.before}
            afterSrc={HOME_BEFORE_AFTER.after}
            beforeAlt={beforeAlt}
            afterAlt={afterAlt}
          />
        </FadeIn>

        {subtitle.trim() ? (
          <FadeIn className="mt-6 text-center sm:mt-8" delay={200}>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-site-muted sm:text-xs">
              {subtitle}
            </p>
          </FadeIn>
        ) : null}

        {ctaLabel?.trim() && ctaHref?.trim() ? (
          <FadeIn className="mt-8 text-center sm:mt-10" delay={260}>
            <Link
              href={ctaHref}
              className="site-btn-secondary h-11 rounded-full px-8 text-[10px] tracking-[0.24em] sm:text-[11px]"
            >
              {ctaLabel}
            </Link>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
