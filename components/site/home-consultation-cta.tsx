"use client";

import { Mail, Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import type { Locale } from "@/lib/i18n";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  locale: Locale;
  privacyHref: string;
  callDisplay?: string;
  callHref?: string;
  emailDisplay?: string;
  emailHref?: string;
};

export function HomeConsultationCta({
  eyebrow,
  title,
  subtitle,
  locale,
  privacyHref,
  callDisplay = "",
  callHref,
  emailDisplay = "",
  emailHref,
}: Props) {
  const phone = callDisplay.trim();
  const email = emailDisplay.trim();

  return (
    <section
      id="kontakt"
      className="scroll-mt-header relative z-20 overflow-x-hidden border-t border-site-border bg-site-surface-a py-section-y"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.34em] text-site-subtle">
              {eyebrow}
            </p>
            <h2
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.08] tracking-tight text-site-ink"
            >
              {title}
            </h2>
            {subtitle.trim() ? (
              <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-site-muted sm:text-base">
                {subtitle}
              </p>
            ) : null}

            {(phone || email) && (
              <ul className="mt-10 space-y-4 border-t border-site-border pt-8">
                {phone ? (
                  <li>
                    <a
                      href={callHref || `tel:${phone.replace(/\s/g, "")}`}
                      className="group flex items-center gap-4 text-site-muted transition hover:text-site-brand-accent"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-site-border bg-site-card text-site-ink transition group-hover:border-site-brand group-hover:text-site-brand-accent">
                        <Phone size={18} strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-site-subtle">
                          Telefon
                        </span>
                        <span className="text-[0.9375rem] font-medium text-site-ink">
                          {phone}
                        </span>
                      </span>
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a
                      href={emailHref || `mailto:${email}`}
                      className="group flex items-center gap-4 text-site-muted transition hover:text-site-brand-accent"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-site-border bg-site-card text-site-ink transition group-hover:border-site-brand group-hover:text-site-brand-accent">
                        <Mail size={18} strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-site-subtle">
                          Email
                        </span>
                        <span className="text-[0.9375rem] font-medium text-site-ink">
                          {email}
                        </span>
                      </span>
                    </a>
                  </li>
                ) : null}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-site-border bg-site-card px-5 py-7 shadow-site-card-lg sm:px-10 sm:py-10">
            <ContactForm locale={locale} privacyHref={privacyHref} embedded />
          </div>
        </div>
      </div>
    </section>
  );
}
