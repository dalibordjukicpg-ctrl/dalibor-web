import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { TabbedSiteStringsForm } from "@/components/admin/tabbed-site-strings-form";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-panel";
import { frontendHintForAdminPath } from "@/lib/admin/site-content-nav";
import { buildSiteStringMatrix } from "@/lib/admin/build-site-matrix";

export const dynamic = "force-dynamic";

export default async function ProcessContentPage() {
  const matrix = await buildSiteStringMatrix();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <AdminPageHeader
        title="Proces rada"
        description="Četiri koraka na početnoj stranici — Otkrivanje, Dizajn, Finalizacija, Realizacija."
      />
      <AdminFrontendHint>
        {frontendHintForAdminPath("content/process")}
      </AdminFrontendHint>

      <AdminPanel title="Tekstovi procesa">
        <TabbedSiteStringsForm group="process" matrix={matrix} />
      </AdminPanel>
    </div>
  );
}
