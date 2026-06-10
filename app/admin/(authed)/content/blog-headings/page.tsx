import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { TabbedSiteStringsForm } from "@/components/admin/tabbed-site-strings-form";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-panel";
import { frontendHintForAdminPath } from "@/lib/admin/site-content-nav";
import { buildSiteStringMatrix } from "@/lib/admin/build-site-matrix";

export const dynamic = "force-dynamic";

export default async function BlogHeadingsContentPage() {
  const matrix = await buildSiteStringMatrix();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <AdminPageHeader
        title="Naslovi blog sekcije"
        description="Tekst iznad liste članaka na početnoj stranici."
      />
      <AdminFrontendHint>
        {frontendHintForAdminPath("content/blog-headings")}
      </AdminFrontendHint>

      <AdminPanel title="Naslovi i linkovi">
        <TabbedSiteStringsForm group="blogHeadings" matrix={matrix} />
      </AdminPanel>
    </div>
  );
}
