import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { TabbedSiteStringsForm } from "@/components/admin/tabbed-site-strings-form";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-panel";
import { frontendHintForAdminPath } from "@/lib/admin/site-content-nav";
import { buildSiteStringMatrix } from "@/lib/admin/build-site-matrix";

export const dynamic = "force-dynamic";

export default async function ShowcaseContentPage() {
  const matrix = await buildSiteStringMatrix();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <AdminPageHeader
        title="Video klipovi"
        description="Tri video trake jedna ispod druge — naslovi i dugme ispod."
      />
      <AdminFrontendHint>
        {frontendHintForAdminPath("content/showcase")}
      </AdminFrontendHint>

      <AdminPanel title="Tekstovi video sekcije">
        <TabbedSiteStringsForm group="showcase" matrix={matrix} />
      </AdminPanel>
    </div>
  );
}
