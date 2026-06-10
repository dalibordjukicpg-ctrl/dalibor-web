/** Neutralna pozadina admin panela — bez kliničkih / IVF vizuala. */
export function AdminBackdrop() {
  return (
    <div
      aria-hidden
      className="admin-backdrop pointer-events-none fixed inset-0 -z-10 select-none bg-[#f7f6f4]"
    />
  );
}
