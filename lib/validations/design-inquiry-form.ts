import { z } from "zod";

import { locales, type Locale } from "@/lib/i18n";

const stripControl = (s: string) => s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

const requiredText = (min: number, message: string) =>
  z
    .string()
    .max(200)
    .transform((v) => stripControl(v.trim()))
    .refine((v) => v.length >= min, { message });

export const designInquiryClientSchema = z.object({
  locale: z.enum(locales),
  firstName: requiredText(2, "Ime mora imati najmanje 2 karaktera."),
  lastName: requiredText(2, "Prezime mora imati najmanje 2 karaktera."),
  email: z
    .string()
    .max(255)
    .transform((v) => stripControl(v.trim().toLowerCase()))
    .pipe(z.string().email({ message: "Email nije ispravan." })),
  phone: z
    .string()
    .max(64)
    .transform((v) => stripControl(v.replace(/\s+/g, " ").trim()))
    .refine((v) => v.length >= 6, { message: "Telefon mora imati najmanje 6 karaktera." }),
  address: requiredText(3, "Adresa je obavezna."),
  city: requiredText(2, "Grad je obavezan."),
  stateRegion: requiredText(2, "Regija je obavezna."),
  postalCode: requiredText(2, "Poštanski broj je obavezan."),
  country: z
    .string()
    .max(120)
    .optional()
    .transform((v) => {
      const t = stripControl((v ?? "").trim());
      return t.length === 0 ? undefined : t;
    }),
  findUs: z
    .array(z.string().max(80))
    .min(1, { message: "Izaberite barem jednu opciju." }),
  amenities: z
    .array(z.string().max(80))
    .min(1, { message: "Izaberite barem jedan element." }),
  consentAccepted: z.boolean().refine((v) => v === true, {
    message: "Potrebna je saglasnost za obradu ličnih podataka.",
  }),
});

export type DesignInquiryClientValues = z.input<typeof designInquiryClientSchema>;

export type DesignInquiryLocale = Locale;
