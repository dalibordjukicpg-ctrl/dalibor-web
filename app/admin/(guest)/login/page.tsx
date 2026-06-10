import Link from "next/link";

import { LoginForm } from "./login-form";
import { AdminLoginBrand } from "@/components/admin/admin-login-brand";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-base-path";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const rawNext =
    typeof sp.next === "string"
      ? sp.next
      : Array.isArray(sp.next)
        ? sp.next[0]
        : "";
  const redirectTo =
    rawNext.startsWith(`${ADMIN_BASE_PATH}/`) && !rawNext.startsWith("//")
      ? rawNext
      : ADMIN_BASE_PATH;

  return (
    <main className="relative min-h-dvh px-4 py-14 md:py-20">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <div className="flex justify-center">
            <AdminLoginBrand />
          </div>

          <p className="mt-8 font-header-nav text-[11px] font-semibold uppercase tracking-[0.22em] text-site-brand-muted">
            Administracija
          </p>
          <h1 className="mt-2 font-serif text-[1.65rem] font-semibold leading-snug tracking-tight text-site-ink md:text-[1.85rem]">
            Prijava
          </h1>
          <p className="mt-2 text-sm text-site-muted">
            Unesite podatke za pristup admin panelu.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-site-border bg-white p-6 shadow-site-card md:p-8">
          <LoginForm redirectTo={redirectTo} />
        </div>

        <p className="mt-8 text-center text-sm text-site-muted">
          <Link href="/me" className="text-site-brand hover:text-site-brand-hover">
            ← Nazad na sajt
          </Link>
        </p>
      </div>
    </main>
  );
}
