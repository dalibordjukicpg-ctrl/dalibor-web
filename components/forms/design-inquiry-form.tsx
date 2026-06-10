"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  buildDesignInquiryMessage,
  getDesignInquiryCopy,
  type DesignInquiryOption,
} from "@/lib/design-inquiry-copy";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  designInquiryClientSchema,
  type DesignInquiryClientValues,
} from "@/lib/validations/design-inquiry-form";

type Props = {
  locale: Locale;
  privacyHref: string;
  className?: string;
};

const inputCls =
  "mt-1.5 w-full rounded-sm border border-site-border bg-white px-4 py-3 text-[0.9375rem] text-site-ink placeholder:text-site-subtle transition-colors focus:border-site-brand focus:outline-none focus:ring-2 focus:ring-site-brand/25";
const labelCls = "text-sm font-medium text-site-muted";

function RequiredMark() {
  return (
    <span className="ml-0.5 text-site-brand" aria-hidden>
      *
    </span>
  );
}

function CheckboxGroup({
  options,
  value,
  onChange,
  name,
  error,
}: {
  options: DesignInquiryOption[];
  value: string[];
  onChange: (next: string[]) => void;
  name: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = value.includes(opt.value);
        const id = `${name}-${opt.value.replace(/\s+/g, "-").toLowerCase()}`;
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className="flex cursor-pointer items-start gap-3 rounded-sm px-1 py-1.5 text-sm text-site-muted hover:bg-site-surface-b"
          >
            <input
              id={id}
              type="checkbox"
              checked={checked}
              onChange={() => {
                if (checked) {
                  onChange(value.filter((v) => v !== opt.value));
                } else {
                  onChange([...value, opt.value]);
                }
              }}
              className="mt-0.5 h-4 w-4 rounded border-site-border bg-white text-site-brand focus:ring-site-brand"
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function DesignInquiryForm({ locale, privacyHref, className }: Props) {
  const copy = getDesignInquiryCopy(locale);
  const hpRef = useRef<HTMLInputElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formDefaults = useMemo<DesignInquiryClientValues>(
    () => ({
      locale,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      stateRegion: "",
      postalCode: "",
      country: "",
      findUs: [],
      amenities: [],
      consentAccepted: false,
    }),
    [locale],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DesignInquiryClientValues>({
    resolver: zodResolver(designInquiryClientSchema),
    defaultValues: formDefaults,
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSuccess(false);

    const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
    const message = buildDesignInquiryMessage(values, locale);
    const body = {
      locale: values.locale,
      fullName,
      email: values.email,
      phone: values.phone,
      inquiryType:
        locale === "en" ? "Transform your space" : "Transformišite prostor",
      message,
      consentAccepted: values.consentAccepted,
      form_hp_token: hpRef.current?.value?.trim() ?? "",
    };

    let res: Response;
    try {
      res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      setSubmitError("Mrežna greška. Provjerite vezu i pokušajte ponovo.");
      return;
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      setSubmitError("Odgovor servera nije mogao biti obrađen. Pokušajte kasnije.");
      return;
    }

    if (typeof data !== "object" || data === null || !("ok" in data)) {
      setSubmitError("Slanje nije uspjelo. Pokušajte kasnije.");
      return;
    }

    const payload = data as {
      ok: boolean;
      error?: string;
      fieldErrors?: Record<string, string>;
    };

    if (res.status === 429) {
      setSubmitError(
        payload.error ?? "Previše zahtjeva. Sačekajte pa pokušajte ponovo.",
      );
      return;
    }

    if (!payload.ok) {
      if (payload.fieldErrors) {
        for (const [key, msg] of Object.entries(payload.fieldErrors)) {
          if (key in formDefaults) {
            setError(key as keyof DesignInquiryClientValues, {
              type: "server",
              message: msg,
            });
          }
        }
      }
      setSubmitError(
        payload.error ??
          (res.status >= 400
            ? "Provjerite podatke i pokušajte ponovo."
            : "Slanje nije uspjelo."),
      );
      return;
    }

    if (!res.ok) {
      setSubmitError(payload.error ?? "Slanje nije uspjelo. Pokušajte kasnije.");
      return;
    }

    setSuccess(true);
    reset(formDefaults);
    if (hpRef.current) hpRef.current.value = "";
  });

  return (
    <div className={cn(className)}>
      {success ? (
        <p
          className="mb-6 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          {copy.success}
        </p>
      ) : null}

      {submitError ? (
        <p
          className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {submitError}
        </p>
      ) : null}

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <input type="hidden" {...register("locale")} />

        <div className="sr-only" aria-hidden>
          <label htmlFor="design_inquiry_hp">Ne popunjavati</label>
          <input
            ref={hpRef}
            id="design_inquiry_hp"
            name="form_hp_dummy"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry_firstName" className={labelCls}>
              {copy.firstName}
              <RequiredMark />
            </label>
            <input
              id="inquiry_firstName"
              type="text"
              autoComplete="given-name"
              className={inputCls}
              {...register("firstName")}
            />
            {errors.firstName ? (
              <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="inquiry_lastName" className={labelCls}>
              {copy.lastName}
              <RequiredMark />
            </label>
            <input
              id="inquiry_lastName"
              type="text"
              autoComplete="family-name"
              className={inputCls}
              {...register("lastName")}
            />
            {errors.lastName ? (
              <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry_phone" className={labelCls}>
              {copy.phone}
              <RequiredMark />
            </label>
            <input
              id="inquiry_phone"
              type="tel"
              autoComplete="tel"
              className={inputCls}
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="inquiry_email" className={labelCls}>
              {copy.email}
              <RequiredMark />
            </label>
            <input
              id="inquiry_email"
              type="email"
              autoComplete="email"
              className={inputCls}
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="inquiry_address" className={labelCls}>
            {copy.address}
            <RequiredMark />
          </label>
          <input
            id="inquiry_address"
            type="text"
            autoComplete="street-address"
            className={inputCls}
            {...register("address")}
          />
          {errors.address ? (
            <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry_city" className={labelCls}>
              {copy.city}
              <RequiredMark />
            </label>
            <input
              id="inquiry_city"
              type="text"
              autoComplete="address-level2"
              className={inputCls}
              {...register("city")}
            />
            {errors.city ? (
              <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="inquiry_stateRegion" className={labelCls}>
              {copy.stateRegion}
              <RequiredMark />
            </label>
            <input
              id="inquiry_stateRegion"
              type="text"
              autoComplete="address-level1"
              className={inputCls}
              {...register("stateRegion")}
            />
            {errors.stateRegion ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.stateRegion.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry_postalCode" className={labelCls}>
              {copy.postalCode}
              <RequiredMark />
            </label>
            <input
              id="inquiry_postalCode"
              type="text"
              autoComplete="postal-code"
              className={inputCls}
              {...register("postalCode")}
            />
            {errors.postalCode ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.postalCode.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="inquiry_country" className={labelCls}>
              {copy.country}
            </label>
            <input
              id="inquiry_country"
              type="text"
              autoComplete="country-name"
              className={inputCls}
              {...register("country")}
            />
          </div>
        </div>

        <fieldset className="space-y-3 pt-2">
          <legend className={labelCls}>
            {copy.findUsTitle}
            <RequiredMark />
          </legend>
          <Controller
            name="findUs"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                name="findUs"
                options={copy.findUsOptions}
                value={field.value ?? []}
                onChange={field.onChange}
                error={errors.findUs?.message as string | undefined}
              />
            )}
          />
        </fieldset>

        <fieldset className="space-y-3 pt-2">
          <legend className={labelCls}>
            {copy.amenitiesTitle}
            <RequiredMark />
          </legend>
          <Controller
            name="amenities"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                name="amenities"
                options={copy.amenitiesOptions}
                value={field.value ?? []}
                onChange={field.onChange}
                error={errors.amenities?.message as string | undefined}
              />
            )}
          />
        </fieldset>

        <div className="flex items-start gap-3 pt-2">
          <input
            id="inquiry_consent"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-site-border bg-white text-site-brand focus:ring-site-brand"
            {...register("consentAccepted")}
          />
          <label htmlFor="inquiry_consent" className="text-sm leading-snug text-site-muted">
            {copy.consent}{" "}
            <Link
              href={privacyHref}
              className="font-medium text-site-ink underline-offset-4 hover:text-site-brand-accent hover:underline"
            >
              {copy.consentLink}
            </Link>
            .
            <RequiredMark />
          </label>
        </div>
        {errors.consentAccepted ? (
          <p className="text-xs text-red-600">
            {errors.consentAccepted.message as string}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="site-btn-primary mt-4 h-12 min-w-[10rem] px-8 text-sm tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? copy.submitting : copy.submit}
        </button>
      </form>
    </div>
  );
}
