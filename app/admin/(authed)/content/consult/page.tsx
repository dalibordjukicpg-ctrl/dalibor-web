import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { TabbedSiteStringsForm } from "@/components/admin/tabbed-site-strings-form";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-panel";
import { frontendHintForAdminPath } from "@/lib/admin/site-content-nav";
import { buildSiteStringMatrix } from "@/lib/admin/build-site-matrix";

export const dynamic = "force-dynamic";

export default async function ConsultContentPage() {
  const matrix = await buildSiteStringMatrix();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <AdminPageHeader
        title="Kontakt forma"
        description="Sekcija sa formom na početnoj — naslov, podnaslov i dugme."
      />
      <AdminFrontendHint>
        {frontendHintForAdminPath("content/consult")}
      </AdminFrontendHint>

      <AdminPanel title="Tekstovi kontakt sekcije">
        <TabbedSiteStringsForm group="consult" matrix={matrix} />
      </AdminPanel>
    </div>
  );
}
