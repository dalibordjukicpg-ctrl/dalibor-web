/**
 * Minimalna pozadina — čist canvas bez medicinskih efekata.
 * Foxterra stil: puno bijelog prostora, bez blobova.
 */
export function GlobalBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-site-canvas"
    />
  );
}
