import { DEFAULT_HEADER_LOGO } from "@/lib/clinic-assets";

export type SiteLogoVariant = "header" | "headerOnHero" | "footer" | "hero" | "mobileMenu" | "admin";

const VARIANT_CLASS: Record<SiteLogoVariant, string> = {
  header:
    "h-14 w-auto max-w-[min(100%,320px)] object-contain object-left sm:h-16 lg:h-[4.5rem] lg:max-w-[400px]",
  headerOnHero:
    "h-14 w-auto max-w-[min(100%,320px)] object-contain object-left sm:h-16 lg:h-[4.5rem] lg:max-w-[400px] site-header-logo-on-hero",
  footer:
    "h-16 w-auto max-w-[min(100%,300px)] object-contain object-left lg:h-20 lg:max-w-[360px]",
  hero:
    "h-auto w-[min(100%,300px)] object-contain object-left sm:w-[min(100%,380px)] lg:w-[min(100%,460px)] hero-home-logo",
  mobileMenu:
    "h-12 w-auto max-w-[min(100%,260px)] object-contain object-left",
  admin:
    "h-10 w-auto max-w-[min(100%,220px)] object-contain object-left",
};

type Props = {
  alt?: string;
  variant?: SiteLogoVariant;
  className?: string;
  priority?: boolean;
};

export function SiteLogo({
  alt = "",
  variant = "header",
  className = "",
  priority = false,
}: Props) {
  const src = DEFAULT_HEADER_LOGO;
  if (!src) return null;

  const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(" ");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={classes}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      draggable={false}
    />
  );
}
