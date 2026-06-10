import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-[var(--site-ink)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--site-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function AdminPanel({
  title,
  description,
  className,
  children,
}: {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[var(--site-border)] bg-white/95 p-6 shadow-[var(--shadow-site-card)] backdrop-blur-sm",
        className,
      )}
    >
      {title ? (
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[var(--site-ink)]">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-[var(--site-muted)]">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
