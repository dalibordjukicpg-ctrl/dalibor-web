import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { HomeTeamHighlightsEditor } from "@/components/admin/home-team-highlights-editor";
import { TabbedSiteStringsForm } from "@/components/admin/tabbed-site-strings-form";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-panel";
import { frontendHintForAdminPath } from "@/lib/admin/site-content-nav";
import { buildSiteStringMatrix } from "@/lib/admin/build-site-matrix";
import {
  listHomeTeamHighlightsAdmin,
  resolveLinkedPagesForTeamHighlights,
} from "@/lib/queries/home-team-highlights";
import { listMediaOptions } from "@/lib/queries/media-admin";

export const dynamic = "force-dynamic";

export default async function HomeTeamContentPage() {
  const [matrix, media, teamHighlights] = await Promise.all([
    buildSiteStringMatrix(),
    listMediaOptions(),
    listHomeTeamHighlightsAdmin(),
  ]);
  const linkedPagesByHighlightId =
    await resolveLinkedPagesForTeamHighlights(teamHighlights);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <AdminPageHeader
        title="Testimonijali"
        description="Citati klijenata na početnoj — naslov sekcije, fallback citati i kartice iz baze."
      />
      <AdminFrontendHint>
        {frontendHintForAdminPath("content/team")}
      </AdminFrontendHint>

      <AdminPanel
        title="Testimonijali — tekstovi"
        description="Naslov sekcije i rezervni citati (ako nema kartica u bazi)."
      >
        <div className="team-admin-strings [&_button[type=submit]]:border-0 [&_button[type=submit]]:bg-[var(--site-brand)] [&_button[type=submit]]:hover:bg-[var(--site-brand-hover)] [&_textarea]:border-[var(--site-border)] [&_textarea]:focus:border-[var(--site-brand)] [&_textarea]:focus:ring-[var(--site-brand)]/20">
          <TabbedSiteStringsForm
            group="team"
            matrix={matrix}
            className="lg:grid-cols-1"
          />
        </div>
      </AdminPanel>

      <AdminPanel
        title="Kartice desno (tekst, slike, link)"
        description="Za svaku karticu: kratki tekst na početnoj i pun editor ispod (naslovi, pasusi, slike iz Medija)."
      >
        <HomeTeamHighlightsEditor
          initialItems={teamHighlights}
          linkedPagesByHighlightId={linkedPagesByHighlightId}
          mediaOptions={media}
        />
      </AdminPanel>

    </div>
  );
}
