/** Javna putanja stranice projekta (bez locale prefiksa). */
export function projectPagePath(slug: string): string {
  return `/projekti/${slug.trim()}`;
}

/** Normalizuje slug za URL (mala slova, crtice). */
export function sanitizeProjectSlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s.length > 0 ? s.slice(0, 128) : null;
}

/** Razbija tekst stranice na odlomke (prazni redovi). */
export function splitProjectBody(body: string | null | undefined): string[] {
  if (!body?.trim()) return [];
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
