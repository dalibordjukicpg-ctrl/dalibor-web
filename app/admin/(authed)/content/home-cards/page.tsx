import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { TabbedSiteStringsForm } from "@/components/admin/tabbed-site-strings-form";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-panel";
import { frontendHintForAdminPath } from "@/lib/admin/site-content-nav";
import { buildSiteStringMatrix } from "@/lib/admin/build-site-matrix";
import { HomeServiceCardsEditor } from "@/components/admin/home-service-cards-editor";
import { listHomeServiceCardsAdmin } from "@/lib/queries/home-service-cards";
import { listMediaOptions } from "@/lib/queries/media-admin";

export const dynamic = "force-dynamic";

export default async function HomeCardsAdminPage() {
  const [cards, mediaOptions, matrix] = await Promise.all([
    listHomeServiceCardsAdmin(),
    listMediaOptions(),
    buildSiteStringMatrix(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <AdminPageHeader
        title="Portfolio projekti"
        description={
          "Projekti u portfolio sekciji na početnoj. Naslov, opis, slika, link i redoslijed — po jeziku ME i EN."
        }
      />
      <AdminFrontendHint>
        {frontendHintForAdminPath("content/home-cards")}
      </AdminFrontendHint>

      <AdminPanel title="Naslov sekcije i dugme">
        <TabbedSiteStringsForm group="portfolioHeadings" matrix={matrix} />
      </AdminPanel>

      <AdminPanel title="Kartice projekata">
        <HomeServiceCardsEditor initialCards={cards} mediaOptions={mediaOptions} />
      </AdminPanel>
    </div>
  );
}
