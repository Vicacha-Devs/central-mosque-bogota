import type { StrapiEnvFn } from "../plugins";

const SITE_BRAND_BY_LOCALE: Record<string, string> = {
  es: "Mezquita Central de Bogotá",
  en: "Central Mosque of Bogotá",
  ar: "مسجد بوغوتا المركزي",
  tr: "Bogotá Merkez Camii",
};

const STATIC_PAGE_PATHS: Record<string, string> = {
  "api::about-page.about-page": "/about-us",
  "api::islam-faith-page.islam-faith-page": "/islam-and-faith",
  "api::donations-page.donations-page": "/donations",
  "api::contact-page.contact-page": "/contact",
  "api::homepage.homepage": "",
};

const COLLECTION_PATH_PREFIXES: Record<string, string> = {
  "api::article.article": "/articles",
  "api::community-service.community-service": "/services",
  "api::leader.leader": "/leaders",
  "plugin::events.event": "/events",
  "plugin::donations.campaign": "/donations",
  "plugin::media-feeds.media-item": "/media",
  "plugin::media-feeds.media-series": "/media/series",
  "plugin::resources.publication": "/islam-and-faith",
  "plugin::resources.gallery-album": "/gallery",
  "plugin::resources.glossary-term": "/islam-and-faith",
  "plugin::bookings.resource": "/bookings",
};

function firstNonEmptyString(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) {
      return c.trim();
    }
  }
  return null;
}

export function buildSeoPluginConfig(env: StrapiEnvFn) {
  const siteUrl = env("PUBLIC_SITE_URL", "https://mezquitabogota.org").replace(
    /\/+$/,
    ""
  );

  return {
    enabled: true,
    config: {
      autoCreateComponent: true,
      autoPopulateOnSave: true,
      generateTitle: ({
        doc,
        locale,
      }: {
        doc: Record<string, unknown>;
        locale?: string | null;
      }) => {
        const loc = locale && SITE_BRAND_BY_LOCALE[locale] ? locale : "es";
        const brand = SITE_BRAND_BY_LOCALE[loc];
        const title = firstNonEmptyString(
          doc.title,
          doc.heroTitle,
          doc.name,
          doc.question,
          doc.term
        );
        if (!title) return brand;
        const combined = `${title} — ${brand}`;
        return combined.length <= 60 ? combined : title;
      },
      generateDescription: ({ doc }: { doc: Record<string, unknown> }) =>
        firstNonEmptyString(
          doc.excerpt,
          doc.summary,
          doc.description,
          doc.heroSubtitle,
          doc.bio,
          doc.answer,
          doc.definition
        ),
      generateImage: ({ doc }: { doc: Record<string, unknown> }) =>
        doc.coverImage ?? doc.image ?? doc.poster ?? doc.photo ?? doc.thumbnail ?? null,
      generateURL: ({
        uid,
        doc,
        locale,
      }: {
        uid: string;
        doc: Record<string, unknown>;
        locale?: string | null;
      }) => {
        const loc = locale && SITE_BRAND_BY_LOCALE[locale] ? locale : "es";
        if (uid in STATIC_PAGE_PATHS) {
          return `${siteUrl}/${loc}${STATIC_PAGE_PATHS[uid]}`;
        }
        const prefix = COLLECTION_PATH_PREFIXES[uid];
        const slug = firstNonEmptyString(doc.slug);
        if (prefix && slug) {
          return `${siteUrl}/${loc}${prefix}/${slug}`;
        }
        return `${siteUrl}/${loc}`;
      },
    },
  };
}
