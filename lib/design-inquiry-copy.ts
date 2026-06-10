import type { Locale } from "@/lib/i18n";

export type DesignInquiryOption = { value: string; label: string };

type Copy = {
  pageTitle: string;
  pageIntro: string;
  banner: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  country: string;
  findUsTitle: string;
  findUsOptions: DesignInquiryOption[];
  amenitiesTitle: string;
  amenitiesOptions: DesignInquiryOption[];
  consent: string;
  consentLink: string;
  submit: string;
  submitting: string;
  success: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
};

const ME: Copy = {
  pageTitle: "Spremni da transformišete svoj prostor?",
  pageIntro:
    "Popunite formu ispod i naš tim će vas kontaktirati u roku od 24–48 sati. Besplatna konsultacija uključuje razgovor o vašoj viziji, lokaciji i mogućnostima prostora.",
  banner: "Zakažite besplatnu dizajn konsultaciju",
  firstName: "Ime",
  lastName: "Prezime",
  phone: "Telefon",
  email: "Email",
  address: "Adresa",
  city: "Grad",
  stateRegion: "Regija",
  postalCode: "Poštanski broj",
  country: "Država",
  findUsTitle: "Kako ste nas pronašli?",
  findUsOptions: [
    { value: "Instagram", label: "Instagram" },
    { value: "TikTok", label: "TikTok" },
    { value: "YouTube", label: "YouTube" },
    { value: "Pinterest", label: "Pinterest" },
    { value: "Email", label: "Email" },
    { value: "Google", label: "Google pretraga" },
    { value: "Komšija", label: "Komšija" },
    { value: "Prijatelj / porodica", label: "Prijatelj / porodica" },
    { value: "Facebook", label: "Facebook" },
    { value: "Reklama", label: "Reklama" },
    { value: "Magazin", label: "Magazin" },
  ],
  amenitiesTitle:
    "Označite elemente koje želite u svom eksterijeru. Možete izabrati više opcija.",
  amenitiesOptions: [
    { value: "Bazen", label: "Bazen" },
    { value: "Spa / hidromasaža", label: "Spa / hidromasaža" },
    { value: "Roštilj / outdoor kuhinja", label: "Roštilj / outdoor kuhinja" },
    { value: "Ognjište", label: "Ognjište" },
    { value: "Infinity rub", label: "Infinity rub" },
    { value: "Prilaz / popločavanje", label: "Prilaz / popločavanje" },
    { value: "Živa ograda", label: "Živa ograda" },
    { value: "Umjetnički elementi", label: "Umjetnički elementi" },
    { value: "Bar", label: "Bar" },
    { value: "Travnjak / green", label: "Travnjak / green" },
    { value: "Kišna zavjesa", label: "Kišna zavjesa" },
    { value: "Vodeni element", label: "Vodeni element" },
    { value: "Outdoor media", label: "Outdoor media" },
  ],
  consent: "Saglasan/sam sam sa",
  consentLink: "obradom ličnih podataka",
  submit: "Pošalji upit",
  submitting: "Šaljem…",
  success:
    "Hvala! Upit je primljen. Javićemo vam se u najkraćem roku.",
  breadcrumbHome: "Početna",
  breadcrumbCurrent: "Transformišite prostor",
};

const EN: Copy = {
  pageTitle: "Ready to transform your space?",
  pageIntro:
    "Fill out the form below and our team will reach out within 24–48 hours. Your free consultation includes a conversation about your vision, location, and what is possible for your outdoor space.",
  banner: "Book your free design consultation",
  firstName: "First name",
  lastName: "Last name",
  phone: "Phone number",
  email: "Email",
  address: "Address",
  city: "City",
  stateRegion: "State / region",
  postalCode: "Postal code",
  country: "Country / region",
  findUsTitle: "How did you find us?",
  findUsOptions: [
    { value: "Instagram", label: "Instagram" },
    { value: "TikTok", label: "TikTok" },
    { value: "YouTube", label: "YouTube" },
    { value: "Pinterest", label: "Pinterest" },
    { value: "Email", label: "Email" },
    { value: "Google", label: "Google search" },
    { value: "Neighbor", label: "Neighbor" },
    { value: "Friend / family", label: "Friend / family" },
    { value: "Facebook", label: "Facebook" },
    { value: "Ad", label: "Ad" },
    { value: "Magazine", label: "Magazine" },
  ],
  amenitiesTitle:
    "Check the amenities you want in your outdoor space. Select all that apply.",
  amenitiesOptions: [
    { value: "Pool", label: "Pool" },
    { value: "Spa", label: "Spa" },
    { value: "BBQ", label: "BBQ" },
    { value: "Firepit", label: "Firepit" },
    { value: "Infinity edge", label: "Infinity edge" },
    { value: "Driveway", label: "Driveway" },
    { value: "Privacy hedge", label: "Privacy hedge" },
    { value: "Custom art", label: "Custom art" },
    { value: "Bar", label: "Bar" },
    { value: "Putting green", label: "Putting green" },
    { value: "Rain curtain", label: "Rain curtain" },
    { value: "Water feature", label: "Water feature" },
    { value: "Media wall", label: "Media wall" },
  ],
  consent: "I agree to the",
  consentLink: "processing of personal data",
  submit: "Submit inquiry",
  submitting: "Sending…",
  success:
    "Thank you! Your inquiry was received. We will get back to you shortly.",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Transform your space",
};

const MAP: Record<Locale, Copy> = {
  me: ME,
  en: EN,
  ru: ME,
};

export function getDesignInquiryCopy(locale: Locale): Copy {
  return MAP[locale] ?? ME;
}

export function buildDesignInquiryMessage(
  values: {
    address: string;
    city: string;
    stateRegion: string;
    postalCode: string;
    country?: string;
    findUs: string[];
    amenities: string[];
  },
  locale: Locale,
): string {
  const isEn = locale === "en";
  const lines = [
    isEn ? "DESIGN INQUIRY — TRANSFORM YOUR SPACE" : "UPIT — TRANSFORMIŠITE PROSTOR",
    "",
    isEn ? "Address" : "Adresa",
    values.address,
    `${isEn ? "City" : "Grad"}: ${values.city}`,
    `${isEn ? "Region" : "Regija"}: ${values.stateRegion}`,
    `${isEn ? "Postal code" : "Poštanski broj"}: ${values.postalCode}`,
    values.country?.trim()
      ? `${isEn ? "Country" : "Država"}: ${values.country.trim()}`
      : null,
    "",
    isEn ? "How they found us" : "Kako su nas pronašli",
    values.findUs.join(", "),
    "",
    isEn ? "Desired amenities" : "Željeni elementi",
    values.amenities.join(", "),
  ];
  return lines.filter((line) => line !== null).join("\n");
}
