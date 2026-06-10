import { existsSync } from "fs";
import path from "path";

import { FALLBACK_HERO_IMAGE_REL } from "@/lib/clinic-assets";
import {
  isHeroBackgroundVideoUrl,
  isHeroBackgroundYoutubeUrl,
} from "@/lib/hero-background-media";

export { FALLBACK_HERO_IMAGE_REL as FALLBACK_HERO_VIDEO_PATH_REL };

export type HeroVideoAssets = {
  src: string;
  mobileSrc: string | null;
  posterSrc: string | null;
};

function publicFileExists(relativePath: string): boolean {
  const rel = relativePath.replace(/^\//, "");
  return existsSync(path.join(process.cwd(), "public", rel));
}

/**
 * Hero pozadina: CMS URL → podrazumijevana pejzažna slika.
 * (Motrenko video više nije fallback.)
 */
export function resolveHeroBackgroundUrl(fromDb: string | null | undefined): string | null {
  const u = fromDb?.trim();
  if (u) {
    if (isHeroBackgroundVideoUrl(u) || isHeroBackgroundYoutubeUrl(u)) return u;
    if (u.startsWith("/") || /^https?:\/\//i.test(u)) return u;
  }
  if (publicFileExists(FALLBACK_HERO_IMAGE_REL)) return FALLBACK_HERO_IMAGE_REL;
  return null;
}

/** Poster + mobilna varijanta samo za lokalne video fajlove. */
export function resolveHeroVideoAssets(
  mediaUrl: string | null | undefined,
): HeroVideoAssets | null {
  const u = mediaUrl?.trim();
  if (!u || !isHeroBackgroundVideoUrl(u)) return null;

  const localMatch = u.match(/^\/video\/(.+)\.mp4$/i);
  if (localMatch) {
    const base = localMatch[1];
    const poster = `/video/${base}-poster.jpg`;
    const mobile = `/video/${base}-720.mp4`;
    return {
      src: u,
      mobileSrc: publicFileExists(mobile) ? mobile : null,
      posterSrc: publicFileExists(poster) ? poster : null,
    };
  }

  return { src: u, mobileSrc: null, posterSrc: null };
}
