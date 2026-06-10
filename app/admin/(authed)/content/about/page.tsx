import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { TeamHomeMediaEditor } from "@/components/admin/team-home-media-editor";
import { TabbedSiteStringsForm } from "@/components/admin/tabbed-site-strings-form";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-panel";
import { frontendHintForAdminPath } from "@/lib/admin/site-content-nav";
import { buildSiteStringMatrix } from "@/lib/admin/build-site-matrix";
import { listMediaOptions } from "@/lib/queries/media-admin";
import { getSiteGlobalsRow } from "@/lib/queries/site-globals";

export const dynamic = "force-dynamic";

export default async function AboutContentPage() {
  const [matrix, globals, media] = await Promise.all([
    buildSiteStringMatrix(),
    getSiteGlobalsRow(),
    listMediaOptions(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <AdminPageHeader
        title="O nama"
        description="Sekcija „Upoznajte dizajnere“ — tekst i fotografija desno."
      />
      <AdminFrontendHint>
        {frontendHintForAdminPath("content/about")}
      </AdminFrontendHint>

      <AdminPanel title="Fotografija dizajnera">
        <TeamHomeMediaEditor
          mediaOptions={media}
          initialTeamHeroMediaId={globals?.teamM1MediaId ?? null}
        />
      </AdminPanel>

      <AdminPanel title="Tekstovi sekcije">
        <TabbedSiteStringsForm group="about" matrix={matrix} />
      </AdminPanel>
    </div>
  );
}
