import Link from "next/link";

import { AdminFrontendHint } from "@/components/admin/admin-frontend-hint";
import { AdminPageHeader } from "@/components/admin/admin-panel";
import { adminPath } from "@/lib/admin-base-path";

export const dynamic = "force-dynamic";

const HOME_FLOW = [
  {
    step: "1",
    title: "Hero",
    hint: "Vrh stranice — naslov, podnaslov, dugmad, pozadina",
    href: adminPath("content/hero"),
  },
  {
    step: "2",
    title: "Kako radimo",
    hint: "Četiri koraka procesa",
    href: adminPath("content/process"),
  },
  {
    step: "3",
    title: "Video klipovi",
    hint: "Tri horizontalne video trake + naslovi",
    href: adminPath("content/showcase"),
  },
  {
    step: "4",
    title: "3D prije / poslije",
    hint: "Slider sa dve slike",
    href: adminPath("content/design3d"),
  },
  {
    step: "5",
    title: "O nama",
    hint: "Tekst + fotografija desno",
    href: adminPath("content/about"),
  },
  {
    step: "6",
    title: "Portfolio",
    hint: "Kartice projekata i naslov sekcije",
    href: adminPath("content/home-cards"),
  },
  {
    step: "7",
    title: "Kontakt forma",
    hint: "Sekcija sa formom na početnoj",
    href: adminPath("content/consult"),
  },
  {
    step: "8",
    title: "Testimonijali",
    hint: "Citati klijenata",
    href: adminPath("content/team"),
  },
  {
    step: "★",
    title: "Stranica „Transformišite prostor“",
    hint: "Posebna stranica sa dugom formom (/transform-prostor)",
    href: adminPath("content/hero"),
    note: "Link hero dugmeta u Hero baneru",
  },
] as const;

export default function AdminHomeOverviewPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <AdminPageHeader
        title="Početna strana"
        description="Redoslijed sekcija na sajtu — kliknite gdje želite nešto promijeniti. Svaka sekcija ima svoju stranicu u meniju."
      />

      <AdminFrontendHint>
        Sve ispod je vidljivo na <strong>/me</strong> (početna) — redom od vrha prema dnu.
      </AdminFrontendHint>

      <ol className="admin-home-flow">
        {HOME_FLOW.map((item) => (
          <li key={`${item.step}-${item.title}`} className="admin-home-flow__item">
            <span className="admin-home-flow__step" aria-hidden>
              {item.step}
            </span>
            <div className="min-w-0 flex-1">
              <Link href={item.href} className="admin-home-flow__title group">
                {item.title}
                <span className="ml-2 text-zinc-400 transition group-hover:text-zinc-900">
                  →
                </span>
              </Link>
              <p className="mt-1 text-sm text-zinc-600">{item.hint}</p>
              {"note" in item && item.note ? (
                <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <p className="text-sm text-zinc-500">
        Naslovi blog sekcije:{" "}
        <Link
          href={adminPath("content/blog-headings")}
          className="font-medium text-zinc-900 underline-offset-2 hover:underline"
        >
          Blog → Naslovi
        </Link>
        . Slike i video:{" "}
        <Link href={adminPath("media")} className="font-medium text-zinc-900 underline-offset-2 hover:underline">
          Mediji
        </Link>
        . Logo:{" "}
        <Link href={adminPath("settings")} className="font-medium text-zinc-900 underline-offset-2 hover:underline">
          Podešavanja
        </Link>
        .
      </p>
    </div>
  );
}
