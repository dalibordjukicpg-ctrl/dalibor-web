import type { Locale } from "@/lib/i18n";

export type ProjectTypeOption = { value: string; label: string };

type Copy = {
  projectTypes: ProjectTypeOption[];
  projectTypePlaceholder: string;
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  messagePlaceholder: string;
  consent: string;
  consentLink: string;
  submit: string;
  submitting: string;
  success: string;
  title: string;
  intro: string;
};

const ME: Copy = {
  title: "Pošaljite upit",
  intro:
    "Opišite projekat ili lokaciju — odgovaramo u roku od 24–48 sati radnim danima.",
  fullName: "Ime i prezime",
  email: "Email",
  phone: "Telefon",
  projectType: "Vrsta projekta",
  projectTypePlaceholder: "Izaberite…",
  projectTypes: [
    { value: "Pejzažni dizajn", label: "Pejzažni dizajn" },
    { value: "Dizajn dvorišta", label: "Dizajn dvorišta" },
    { value: "3D vizualizacija", label: "3D vizualizacija" },
    { value: "Nadzor realizacije", label: "Nadzor realizacije" },
    { value: "Opšti upit", label: "Opšti upit" },
  ],
  message: "Poruka",
  messagePlaceholder: "Lokacija, veličina parcele, stil koji volite, rokovi…",
  consent: "Saglasan/sam sam sa",
  consentLink: "obradom ličnih podataka",
  submit: "Pošalji upit",
  submitting: "Šaljem…",
  success:
    "Hvala! Upit je primljen. Javićemo vam se u najkraćem roku.",
};

const EN: Copy = {
  title: "Send an inquiry",
  intro:
    "Tell us about your project or site — we reply within 24–48 business hours.",
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  projectType: "Project type",
  projectTypePlaceholder: "Select…",
  projectTypes: [
    { value: "Landscape design", label: "Landscape design" },
    { value: "Yard design", label: "Yard design" },
    { value: "3D visualization", label: "3D visualization" },
    { value: "Construction oversight", label: "Construction oversight" },
    { value: "General inquiry", label: "General inquiry" },
  ],
  message: "Message",
  messagePlaceholder: "Location, plot size, preferred style, timeline…",
  consent: "I agree to the",
  consentLink: "processing of personal data",
  submit: "Send inquiry",
  submitting: "Sending…",
  success:
    "Thank you! Your inquiry was received. We will get back to you shortly.",
};

const MAP: Record<Locale, Copy> = {
  me: ME,
  en: EN,
  ru: ME,
};

export function getContactFormCopy(locale: Locale): Copy {
  return MAP[locale] ?? ME;
}
