import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Jasno označava gdje se sadržaj prikazuje na javnom sajtu. */
export function AdminFrontendHint({ children, className }: Props) {
  return (
    <p
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-2 rounded-md border border-[var(--site-border)] bg-[var(--site-surface-a)] px-3 py-2 text-xs leading-relaxed text-[var(--site-muted)]",
        className,
      )}
    >
      <span className="shrink-0 font-semibold uppercase tracking-[0.14em] text-[var(--site-ink)]">
        Na sajtu
      </span>
      <span className="text-[var(--site-subtle)]" aria-hidden>
        →
      </span>
      <span>{children}</span>
    </p>
  );
}
