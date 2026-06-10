import Link from "next/link";

import { HeaderNavManager } from "@/components/admin/header-nav-manager";
import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-panel";
import { adminPath } from "@/lib/admin-base-path";
import { frontendHintForAdminPath } from "@/lib/admin/site-content-nav";
import { listSitePagesForAdmin } from "@/lib/queries/site-pages-admin";
import { loadNavForAdmin } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

export default async function HeaderNavAdminPage() {
  const [navRows, pageOptions] = await Promise.all([
    loadNavForAdmin(),
    listSitePagesForAdmin(),
  ]);

  const pageSelect = pageOptions.map((p) => ({
    slug: p.slug,
    titleMe: p.titleMe,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AdminPageHeader
        title="Header navigacija"
        description="Glavne kategorije i podkategorije u gornjem meniju. Redosled mijenjate strelicama; podstavke povežite sa CMS stranicama (/s/slug)."
      >
        <Link
          href="/me"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-[var(--site-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--site-brand-muted)] hover:bg-[var(--site-surface-a)]"
        >
          Pregled sajta
        </Link>
      </AdminPageHeader>

      <AdminFrontendHint>
        {frontendHintForAdminPath("content/header")}
      </AdminFrontendHint>

      <AdminPanel
        title="Kako radi meni"
        description="Svaka glavna kategorija može imati podstavke (padajući meni). Logo mijenjate u Podešavanjima."
      >
        <p className="text-sm text-[var(--site-muted)]">
          Tekst dugmeta „Besplatna konsultacija“ i kontakt podaci:{" "}
          <Link
            href={adminPath("content/header-footer")}
            className="font-medium text-[var(--site-brand)] underline underline-offset-2"
          >
            Footer i kontakt
          </Link>
          . Logo:{" "}
          <Link
            href={adminPath("settings")}
            className="font-medium text-[var(--site-brand)] underline underline-offset-2"
          >
            Podešavanja
          </Link>
          .
        </p>
      </AdminPanel>

      <HeaderNavManager rows={navRows} pageOptions={pageSelect} />
    </div>
  );
}
