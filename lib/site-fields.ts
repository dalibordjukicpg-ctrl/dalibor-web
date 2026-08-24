import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

/** Jedinstveni ključevi za `site_locale_strings.field_key`. */
export const SITE_STRING_KEYS = [
  "org.brand",
  "org.subtitle",
  "header.cta_book",
  "header.cta_book_href",
  "header.nav_search_label",
  "header.nav_search_href",

  "hero.line1",
  "hero.line2",
  "hero.subtitle",
  "hero.cta_primary",
  "hero.cta_secondary",
  "hero.cta_primary_href",
  "hero.cta_secondary_href",

  "process.eyebrow",
  "process.title",
  "process.step1.title",
  "process.step1.body",
  "process.step2.title",
  "process.step2.body",
  "process.step3.title",
  "process.step3.body",
  "process.step4.title",
  "process.step4.body",
  "process.cta",
  "process.cta_href",

  "showcase.v1.title",
  "showcase.v2.title",
  "showcase.v3.title",
  "showcase.cta_title",
  "showcase.cta_label",
  "showcase.cta_href",

  "design3d.title",
  "design3d.subtitle",
  "design3d.cta",
  "design3d.cta_href",

  "section.services_title",
  "section.services_subtitle",
  "section.news_title",
  "portfolio.cta_href",
  "portfolio.cta_label",

  "about.eyebrow",
  "about.title",
  "about.body",
  "about.cta",
  "about.cta_href",

  "team.title",
  "team.hl1.title",
  "team.hl1.body",
  "team.hl2.title",
  "team.hl2.body",
  "team.hl3.title",
  "team.hl3.body",

  "home.news_eyebrow",
  "home.news_read_label",

  "consult.eyebrow",
  "consult.title",
  "consult.subtitle",
  "consult.cta",
  "consult.cta_href",

  "footer.tagline",
  "footer.col_portfolio",
  "footer.col_about_nav",
  "footer.col_services_footer",
  "footer.col_contact",
  "footer.about_body",
  "footer.site_domain_label",
  "footer.site_domain_href",
  "footer.hours_title",
  "footer.nav_title",
  "footer.social_title",
  "footer.copyright",
  "footer.crafted",
  "footer.crafted_by",
  "footer.privacy",
  "footer.terms",
  "footer.privacy_href",
  "footer.terms_href",

  "contact.phone1",
  "contact.phone2",
  "contact.email",
  "contact.address",
  "contact.maps_href",

  "social.facebook",
  "social.instagram",
  "social.youtube",
  "social.linkedin",
] as const;

export type SiteStringKey = (typeof SITE_STRING_KEYS)[number];

export const SITE_STRING_LABELS: Record<SiteStringKey, string> = {
  "org.brand": "Naziv studija (logo)",
  "org.subtitle": "Kratak opis / tagline",
  "header.cta_book": "Dugme u headeru (npr. Konsultacija)",
  "header.cta_book_href": "URL / sidro za dugme u headeru (#kontakt)",
  "header.nav_search_label": "Mobilni meni — tekst „Pretraga“",
  "header.nav_search_href": "Mobilni meni — link za pretragu",

  "hero.line1": "Hero — prvi red naslova",
  "hero.line2": "Hero — drugi red / naglašeni",
  "hero.subtitle": "Hero — podnaslov",
  "hero.cta_primary": "Hero — primarno dugme",
  "hero.cta_secondary": "Hero — sekundarno dugme",
  "hero.cta_primary_href": "Hero — link primarnog dugmeta",
  "hero.cta_secondary_href": "Hero — link sekundarnog dugmeta",

  "process.eyebrow": "Proces — mali naslov (eyebrow)",
  "process.title": "Proces — glavni naslov",
  "process.step1.title": "Korak 1 — naslov",
  "process.step1.body": "Korak 1 — opis",
  "process.step2.title": "Korak 2 — naslov",
  "process.step2.body": "Korak 2 — opis",
  "process.step3.title": "Korak 3 — naslov",
  "process.step3.body": "Korak 3 — opis",
  "process.step4.title": "Korak 4 — naslov",
  "process.step4.body": "Korak 4 — opis",
  "process.cta": "Proces — tekst dugmeta",
  "process.cta_href": "Proces — link dugmeta",

  "showcase.v1.title": "Showcase video 1 — naslov",
  "showcase.v2.title": "Showcase video 2 — naslov",
  "showcase.v3.title": "Showcase video 3 — naslov",
  "showcase.cta_title": "Showcase — naslov ispod videa",
  "showcase.cta_label": "Showcase — dugme",
  "showcase.cta_href": "Showcase — link dugmeta",

  "design3d.title": "3D slider — naslov",
  "design3d.subtitle": "3D slider — podnaslov (ispod slike)",
  "design3d.cta": "3D slider — dugme",
  "design3d.cta_href": "3D slider — link dugmeta",

  "section.services_title": "Portfolio — naslov",
  "section.services_subtitle": "Portfolio — eyebrow / podnaslov",
  "section.news_title": "Blog — naslov",
  "portfolio.cta_href": "Portfolio — link „Vidi sve“",
  "portfolio.cta_label": "Portfolio — tekst linka",

  "about.eyebrow": "O nama — eyebrow",
  "about.title": "O nama — naslov",
  "about.body": "O nama — tekst",
  "about.cta": "O nama — dugme",
  "about.cta_href": "O nama — link dugmeta",

  "team.title": "Testimonijali — naslov sekcije",
  "team.hl1.title": "Testimonijal 1 — ime",
  "team.hl1.body": "Testimonijal 1 — citat",
  "team.hl2.title": "Testimonijal 2 — ime",
  "team.hl2.body": "Testimonijal 2 — citat",
  "team.hl3.title": "Testimonijal 3 — ime",
  "team.hl3.body": "Testimonijal 3 — citat",

  "home.news_eyebrow": "Blog — eyebrow",
  "home.news_read_label": "Blog — tekst dugmeta na kartici",

  "consult.eyebrow": "Konsultacija — eyebrow",
  "consult.title": "Konsultacija — naslov",
  "consult.subtitle": "Konsultacija — podnaslov",
  "consult.cta": "Konsultacija — dugme",
  "consult.cta_href": "Konsultacija — link dugmeta",

  "footer.tagline": "Footer — tekst ispod loga",
  "footer.col_portfolio": "Footer — kolona „Portfolio“",
  "footer.col_about_nav": "Footer — kolona „O nama“",
  "footer.col_services_footer": "Footer — kolona „Usluge“",
  "footer.col_contact": "Footer — kolona „Kontakt“",
  "footer.about_body": "Footer — uvodni tekst",
  "footer.site_domain_label": "Footer — prikaz web adrese",
  "footer.site_domain_href": "Footer — puni URL sajta",
  "footer.hours_title": "Footer — naslov radno vrijeme",
  "footer.nav_title": "Footer — naslov navigacije",
  "footer.social_title": "Footer — naslov društvene mreže",
  "footer.copyright": "Footer — tekst uz godinu",
  "footer.crafted": "Footer — „Digital eXperience“ uvod",
  "footer.crafted_by": "Footer — ime izrade (taster)",
  "footer.privacy": "Footer — Politika privatnosti",
  "footer.terms": "Footer — Uslovi",
  "footer.privacy_href": "Footer — putanja politike",
  "footer.terms_href": "Footer — putanja uslova",

  "contact.phone1": "Telefon 1",
  "contact.phone2": "Telefon 2",
  "contact.email": "Email",
  "contact.address": "Adresa",
  "contact.maps_href": "Google Maps URL",

  "social.facebook": "Facebook",
  "social.instagram": "Instagram",
  "social.youtube": "YouTube",
  "social.linkedin": "LinkedIn",
};

const ME_DEFAULTS = {
  "org.brand": "",
  "org.subtitle": "Pejzažna arhitektura i dizajn eksterijera",
  "header.cta_book": "Zakažite konsultaciju",
  "header.cta_book_href": "/transform-prostor",
  "header.nav_search_label": "Pretraga",
  "header.nav_search_href": "/",

  "hero.line1": "Ne zadovoljavajte\nse prostorom",
  "hero.line2": "koji samo volite.",
  "hero.subtitle":
    "Kreiramo eksterijere koje obožavate — pejzaž, arhitektura i 3D dizajn od ideje do realizacije.",
  "hero.cta_primary": "Transformišite svoj prostor",
  "hero.cta_secondary": "Pogledajte portfolio",
  "hero.cta_primary_href": "/transform-prostor",
  "hero.cta_secondary_href": "#portfolio",

  "process.eyebrow": "Kako radimo",
  "process.title": "Vaš san o dvorištu je bliže nego što mislite",
  "process.step1.title": "Otkrivanje",
  "process.step1.body":
    "Razgovaramo o inspiraciji, stilu i načinu na koji želite da koristite budući prostor.",
  "process.step2.title": "Dizajn",
  "process.step2.body":
    "Kreiramo 3D vizualizaciju postojećeg prostora da vidite tačno kako će izgledati završeno djelo.",
  "process.step3.title": "Finalizacija",
  "process.step3.body":
    "Pripremamo projektnu dokumentaciju sa dimenzijama, materijalima i elevacijama.",
  "process.step4.title": "Realizacija",
  "process.step4.body":
    "Besprijekoran prelazak na izvođače koji oživljavaju vaš novi eksterijer.",
  "process.cta": "Započnite projekat",
  "process.cta_href": "#kontakt",

  "showcase.v1.title": "Mediteranske vile iz zraka",
  "showcase.v2.title": "Imanje u zelenilu",
  "showcase.v3.title": "Eksterijer iz drona",
  "showcase.cta_title": "Želite vidjeti više?",
  "showcase.cta_label": "Pogledajte portfolio",
  "showcase.cta_href": "#portfolio",

  "design3d.title": "Zašto dizajniramo u 3D:",
  "design3d.subtitle":
    "Potpuno uranjanje • Realistični prikazi • Doživite svoj novi prostor",
  "design3d.cta": "Naš proces",
  "design3d.cta_href": "#proces",

  "section.services_title": "Odabrani projekti",
  "section.services_subtitle": "Portfolio",
  "section.news_title": "Najnovije sa bloga",
  "portfolio.cta_href": "#portfolio",
  "portfolio.cta_label": "Vidi sve projekte",

  "about.eyebrow": "Upoznajte dizajnere",
  "about.title": "Pejzaž i arhitektura sa vizijom",
  "about.body":
    "Naša misija je da maksimalno iskoristimo potencijal vašeg eksterijera — bez obzira kako trenutno izgleda. Zaslužujete prostor u kojem uživate svaki dan.",
  "about.cta": "Saznajte više",
  "about.cta_href": "#o-nama",

  "team.title": "Šta kažu klijenti",
  "team.hl1.title": "Marko P.",
  "team.hl1.body":
    "Nisam znao da moj prostor može ovako da izgleda dok nisu otkrili taj potencijal.",
  "team.hl2.title": "Ana i Stefan",
  "team.hl2.body": "Tri riječi: savršeno, opuštajuće i inspirativno.",
  "team.hl3.title": "Jelena K.",
  "team.hl3.body": "Još uvijek sam u šoku koliko je prekrasno. Premašili su sva očekivanja.",

  "home.news_eyebrow": "Blog",
  "home.news_read_label": "Pročitajte",

  "consult.eyebrow": "Spremni za transformaciju?",
  "consult.title": "Zakažite besplatnu konsultaciju",
  "consult.subtitle":
    "Popunite formu i naš tim će vas kontaktirati u roku od 24–48 sati.",
  "consult.cta": "Zakažite poziv",
  "consult.cta_href": "#kontakt",

  "footer.tagline":
    "Luksuzni pejzažni i arhitektonski dizajn — od ideje do realizacije.",
  "footer.col_portfolio": "Portfolio",
  "footer.col_about_nav": "O nama",
  "footer.col_services_footer": "Usluge",
  "footer.col_contact": "Kontakt",
  "footer.about_body":
    "Specijalizovani studio za pejzažnu arhitekturu, dizajn dvorišta i eksterijera sa fokusom na 3D vizualizaciju i premium realizaciju.",
  "footer.site_domain_label": "",
  "footer.site_domain_href": "",
  "footer.hours_title": "Radno vrijeme",
  "footer.nav_title": "Navigacija",
  "footer.social_title": "Pratite nas",
  "footer.copyright": "Sva prava zadržana.",
  "footer.crafted": "Digital eXperience",
  "footer.crafted_by": "COMPUTER DOCTOR PODGORICA",
  "footer.privacy": "Politika privatnosti",
  "footer.terms": "Uslovi korišćenja",
  "footer.privacy_href": "/s/politika-privatnosti",
  "footer.terms_href": "/s/uslovi-koriscenja",

  "contact.phone1": "+382 67 000 000",
  "contact.phone2": "",
  "contact.email": "",
  "contact.address": "Podgorica, Crna Gora",
  "contact.maps_href": "https://maps.google.com",

  "social.facebook": "",
  "social.instagram": "https://instagram.com",
  "social.youtube": "",
  "social.linkedin": "",
} satisfies Record<SiteStringKey, string>;

const EN_DEFAULTS: Record<SiteStringKey, string> = {
  ...ME_DEFAULTS,
  "org.subtitle": "Landscape architecture & exterior design",
  "header.cta_book": "Book a consultation",
  "hero.line1": "Don't settle for a space",
  "hero.line2": "you merely like.",
  "hero.subtitle":
    "We create exteriors you'll love — landscape, architecture and 3D design from vision to reality.",
  "hero.cta_primary": "Transform your space",
  "hero.cta_secondary": "View portfolio",
  "hero.cta_primary_href": "/transform-prostor",
  "process.eyebrow": "How we work",
  "process.title": "Your dream outdoor space is closer than you think",
  "process.step1.title": "Discovery",
  "process.step1.body":
    "We discuss inspiration, your design style, and how you envision using your future space.",
  "process.step2.title": "Design",
  "process.step2.body":
    "We create a 3D visualization so you can see exactly what the finished project will look like.",
  "process.step3.title": "Finalization",
  "process.step3.body":
    "We prepare construction documents with dimensions, materials, and elevation drawings.",
  "process.step4.title": "Construction",
  "process.step4.body":
    "A seamless handoff to contractors who bring your new exterior to life.",
  "process.cta": "Start your project",
  "showcase.v1.title": "Mediterranean villas from above",
  "showcase.v2.title": "Manor in the landscape",
  "showcase.v3.title": "Exterior drone view",
  "showcase.cta_title": "Want to see more?",
  "showcase.cta_label": "View portfolio",
  "showcase.cta_href": "#portfolio",
  "design3d.title": "Why we design in 3D:",
  "design3d.subtitle":
    "Total immersion • Realistic visuals • Experiencing your new space",
  "design3d.cta": "Our process",
  "design3d.cta_href": "#proces",
  "section.services_title": "Selected projects",
  "section.services_subtitle": "Portfolio",
  "portfolio.cta_label": "View all projects",
  "section.news_title": "Latest from the blog",
  "about.eyebrow": "Meet the designers",
  "about.title": "Landscape & architecture with vision",
  "about.body":
    "Our mission is to maximize the potential of your exterior — no matter what it looks like today. You deserve a space you actually enjoy.",
  "about.cta": "Learn more",
  "team.title": "What clients say",
  "team.hl1.body":
    "I had no idea my space could look like this until they unlocked that potential.",
  "team.hl2.body": "Three words: perfect, relaxing, and inspiring.",
  "team.hl3.body": "I'm still in shock how beautiful it is. They exceeded every expectation.",
  "home.news_read_label": "Read more",
  "consult.eyebrow": "Ready to transform?",
  "consult.title": "Book your free consultation",
  "consult.subtitle":
    "Fill out the form and our team will reach out within 24–48 hours.",
  "consult.cta": "Book your call",
  "footer.tagline":
    "Luxury landscape and architectural design — from vision to reality.",
  "footer.about_body":
    "A specialized studio for landscape architecture, yard design and exteriors with a focus on 3D visualization and premium execution.",
  "footer.copyright": "All rights reserved.",
  "footer.crafted": "Digital eXperience",
  "footer.crafted_by": "COMPUTER DOCTOR PODGORICA",
  "footer.privacy": "Privacy policy",
  "footer.terms": "Terms of use",
};

type Defaults = Record<"me" | "en" | "ru", Record<SiteStringKey, string>>;

export const SITE_STRING_DEFAULTS: Defaults = {
  me: ME_DEFAULTS,
  en: EN_DEFAULTS,
  ru: {
    ...ME_DEFAULTS,
    "hero.line1": "Не довольствуйтесь пространством,",
    "hero.line2": "которое просто нравится.",
  },
};

export function allSiteStringKeys(): SiteStringKey[] {
  return [...SITE_STRING_KEYS];
}

export function localesList(): readonly Locale[] {
  return locales;
}

export const SITE_STRING_GROUPS = {
  headerFooter: [
    "org.brand",
    "org.subtitle",
    "header.cta_book",
    "header.cta_book_href",
    "header.nav_search_label",
    "header.nav_search_href",
    "footer.tagline",
    "footer.col_portfolio",
    "footer.col_about_nav",
    "footer.col_services_footer",
    "footer.col_contact",
    "footer.about_body",
    "footer.site_domain_label",
    "footer.site_domain_href",
    "footer.hours_title",
    "footer.nav_title",
    "footer.social_title",
    "footer.copyright",
    "footer.crafted",
    "footer.crafted_by",
    "footer.privacy",
    "footer.terms",
    "footer.privacy_href",
    "footer.terms_href",
    "contact.phone1",
    "contact.phone2",
    "contact.email",
    "contact.address",
    "contact.maps_href",
  ] as const satisfies readonly SiteStringKey[],

  hero: [
    "hero.line1",
    "hero.line2",
    "hero.subtitle",
    "hero.cta_primary",
    "hero.cta_secondary",
    "hero.cta_primary_href",
    "hero.cta_secondary_href",
  ] as const satisfies readonly SiteStringKey[],

  process: [
    "process.eyebrow",
    "process.title",
    "process.step1.title",
    "process.step1.body",
    "process.step2.title",
    "process.step2.body",
    "process.step3.title",
    "process.step3.body",
    "process.step4.title",
    "process.step4.body",
    "process.cta",
    "process.cta_href",
  ] as const satisfies readonly SiteStringKey[],

  showcase: [
    "showcase.v1.title",
    "showcase.v2.title",
    "showcase.v3.title",
    "showcase.cta_title",
    "showcase.cta_label",
    "showcase.cta_href",
  ] as const satisfies readonly SiteStringKey[],

  design3d: [
    "design3d.title",
    "design3d.subtitle",
    "design3d.cta",
    "design3d.cta_href",
  ] as const satisfies readonly SiteStringKey[],

  about: [
    "about.eyebrow",
    "about.title",
    "about.body",
    "about.cta",
    "about.cta_href",
  ] as const satisfies readonly SiteStringKey[],

  consult: [
    "consult.eyebrow",
    "consult.title",
    "consult.subtitle",
    "consult.cta",
    "consult.cta_href",
  ] as const satisfies readonly SiteStringKey[],

  portfolioHeadings: [
    "section.services_title",
    "section.services_subtitle",
    "portfolio.cta_href",
    "portfolio.cta_label",
  ] as const satisfies readonly SiteStringKey[],

  blogHeadings: [
    "section.news_title",
    "home.news_eyebrow",
    "home.news_read_label",
  ] as const satisfies readonly SiteStringKey[],

  team: [
    "team.title",
    "team.hl1.title",
    "team.hl1.body",
    "team.hl2.title",
    "team.hl2.body",
    "team.hl3.title",
    "team.hl3.body",
  ] as const satisfies readonly SiteStringKey[],

  social: [
    "social.facebook",
    "social.instagram",
    "social.youtube",
    "social.linkedin",
  ] as const satisfies readonly SiteStringKey[],
} as const;

export const SOCIAL_URL_KEYS = SITE_STRING_GROUPS.social;

export type SiteStringGroupId = keyof typeof SITE_STRING_GROUPS;
