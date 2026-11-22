import type { TLang } from "@i18n/ui";

import { fetchStrapiData } from "./api";

export type TStrapiFormSelectOption = {
  value: string;
  label: string;
};

export type TStrapiFormConfig = {
  title?: string;
  description?: string;
  submitButtonLabel?: string;
  successMessage?: string;
  fieldOptions: Record<string, Array<TStrapiFormSelectOption>>;
};

export type TStrapiBookingResourceConfig = {
  maxPartySize?: number;
};

type RawFormOption = {
  value?: unknown;
  label?: unknown;
  localizedLabels?: Record<string, unknown>;
};

type RawFormField = {
  name?: unknown;
  options?: Array<RawFormOption>;
};

type RawFormTranslation = {
  title?: unknown;
  description?: unknown;
  submitButtonLabel?: unknown;
  successMessage?: unknown;
};

type RawInboxFormResponse = {
  data?: {
    title?: unknown;
    description?: unknown;
    translations?: Record<string, RawFormTranslation | undefined>;
    fields?: Array<RawFormField>;
  };
};

function nonEmptyStr(val: unknown): string | undefined {
  return typeof val === "string" && val.trim().length > 0
    ? val.trim()
    : undefined;
}

/**
 * Fetches a localized form definition from Strapi `inbox/forms/:slug`.
 * Returns `null` when Strapi is offline or the form is unavailable.
 */
export async function fetchInboxFormConfig(
  slug: string,
  lang: TLang
): Promise<TStrapiFormConfig | null> {
  try {
    const res = await fetchStrapiData<RawInboxFormResponse>(
      `inbox/forms/${slug}`,
      { locale: lang }
    );
    const form = res.data;
    if (!form) return null;

    const translation = form.translations?.[lang] ?? form.translations?.es;
    const fieldOptions: Record<string, Array<TStrapiFormSelectOption>> = {};

    if (Array.isArray(form.fields)) {
      for (const field of form.fields) {
        const fieldName = nonEmptyStr(field.name);
        if (!fieldName || !Array.isArray(field.options)) continue;
        const mapped = field.options
          .map((opt) => {
            const value = nonEmptyStr(opt.value);
            if (!value) return null;
            const label =
              nonEmptyStr(opt.localizedLabels?.[lang]) ??
              nonEmptyStr(opt.localizedLabels?.es) ??
              nonEmptyStr(opt.label) ??
              value;
            return { value, label };
          })
          .filter((opt): opt is TStrapiFormSelectOption => opt !== null);

        if (mapped.length > 0) {
          fieldOptions[fieldName] = mapped;
        }
      }
    }

    return {
      title: nonEmptyStr(translation?.title) ?? nonEmptyStr(form.title),
      description:
        nonEmptyStr(translation?.description) ?? nonEmptyStr(form.description),
      submitButtonLabel: nonEmptyStr(translation?.submitButtonLabel),
      successMessage: nonEmptyStr(translation?.successMessage),
      fieldOptions,
    };
  } catch {
    return null;
  }
}

const bookingResourceCache = new Map<
  string,
  Promise<TStrapiBookingResourceConfig | null>
>();

/**
 * Fetches public booking resource settings (e.g., `maxPartySize`) from
 * Strapi `bookings/resources`. Deduplicates concurrent/build-time calls by `slug`,
 * and returns `null` when offline or not found.
 */
export async function fetchBookingResourceConfig(
  slug: string
): Promise<TStrapiBookingResourceConfig | null> {
  if (import.meta.env.MODE !== "test") {
    const cached = bookingResourceCache.get(slug);
    if (cached) return cached;
  }

  const request = (async (): Promise<TStrapiBookingResourceConfig | null> => {
    try {
      const res = await fetchStrapiData<{
        data?: Array<{ slug?: unknown; maxPartySize?: unknown }>;
      }>("bookings/resources", {});
      const resources = Array.isArray(res.data) ? res.data : [];
      if (resources.length === 0) return null;
      const match = resources.find((r) => r.slug === slug) ?? resources[0];

      const maxPartySize =
        typeof match.maxPartySize === "number" &&
        Number.isFinite(match.maxPartySize) &&
        match.maxPartySize > 0
          ? match.maxPartySize
          : undefined;

      return { maxPartySize };
    } catch {
      return null;
    }
  })();

  if (import.meta.env.MODE !== "test") {
    bookingResourceCache.set(slug, request);
  }
  return request;
}
