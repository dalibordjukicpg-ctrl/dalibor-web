import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { TabbedSiteStringsForm } from "@/components/admin/tabbed-site-strings-form";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-panel";
import { frontendHintForAdminPath } from "@/lib/admin/site-content-nav";
import { buildSiteStringMatrix } from "@/lib/admin/build-site-matrix";

export const dynamic = "force-dynamic";

export default async function Design3dContentPage() {
  const matrix = await buildSiteStringMatrix();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <AdminPageHeader
        title="3D prije / poslije"
        description="Slider sa dve slike — naslov, podnaslov i dugme."
      />
      <AdminFrontendHint>
        {frontendHintForAdminPath("content/design3d")}
      </AdminFrontendHint>

      <AdminPanel title="Tekstovi 3D sekcije">
        <TabbedSiteStringsForm group="design3d" matrix={matrix} />
      </AdminPanel>
    </div>
  );
}
