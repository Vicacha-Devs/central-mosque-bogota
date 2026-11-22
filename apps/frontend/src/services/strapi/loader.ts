import type { TLang } from "@i18n/ui";
import { strapiLoader } from "@sensinum/astro-strapi-loader";
import type { Loader, LoaderContext } from "astro/loaders";

export type TResilientStrapiLoaderOptions<
  TItem extends Record<string, unknown>,
> = {
  contentType: string;
  url?: string;
  token?: string;
  locales?: ReadonlyArray<TLang>;
  query?: Record<string, unknown>;
  idField?: keyof TItem & string;
  fallbackByLocale: (lang: TLang) => ReadonlyArray<TItem>;
  mapStrapiEntry?: (raw: Record<string, unknown>, lang: TLang) => TItem;
};

export type TStrapiSingleTypeLoaderOptions<
  TItem extends Record<string, unknown>,
> = {
  contentType: string;
  url?: string;
  token?: string;
  locales?: ReadonlyArray<TLang>;
  query?: Record<string, unknown>;
  fallbackByLocale: (lang: TLang) => TItem;
  mapStrapiEntry?: (raw: Record<string, unknown>, lang: TLang) => TItem;
};

const DEFAULT_LOCALES: ReadonlyArray<TLang> = ["es", "en", "ar", "tr"];
const offlineEndpoints = new Map<string, number>();

/**
 * Wraps `@sensinum/astro-strapi-loader` (`strapiLoader`) with multi-locale support
 * and resilient fallback to localized mock data when Strapi v5 is offline during
 * local development or static CI builds.
 */
export function createResilientStrapiLoader<
  TItem extends Record<string, unknown>,
>(options: TResilientStrapiLoaderOptions<TItem>): Loader {
  const {
    contentType,
    url = process.env.STRAPI_API_URL ?? "http://127.0.0.1:1337",
    token = process.env.STRAPI_API_TOKEN,
    locales = DEFAULT_LOCALES,
    query = { populate: "deep" },
    idField = "slug",
    fallbackByLocale,
    mapStrapiEntry,
  } = options;

  return {
    name: `resilient-strapi-loader:${contentType}`,
    load: async (context: LoaderContext) => {
      const { store, logger } = context;
      store.clear();

      for (const lang of locales) {
        const localizedItems: Array<
          TItem & { documentId: string; locale: TLang }
        > = [];
        let loadedFromStrapi = false;

        const offlineUntil = offlineEndpoints.get(url) ?? 0;
        if (Date.now() < offlineUntil) {
          logger.warn(
            `[${contentType}:${lang}] Strapi unreachable, falling back to localized mocks.`
          );
        } else {
          try {
            const tempRecords = new Map<string, Record<string, unknown>>();
            const innerContext: LoaderContext = {
              ...context,
              store: {
                ...store,
                clear: () => {
                  tempRecords.clear();
                },
                set: (entry) => {
                  tempRecords.set(entry.id, entry.data);
                  return true;
                },
              },
              parseData: ({ data }) => Promise.resolve(data),
            };

            const baseLoader = strapiLoader(
              contentType,
              { url, token },
              { ...query, locale: lang }
            );

            let timeoutId: ReturnType<typeof setTimeout> | undefined;
            try {
              await Promise.race([
                baseLoader.load(innerContext),
                new Promise<never>((_resolve, reject) => {
                  timeoutId = setTimeout(() => {
                    reject(new Error("Strapi loader timeout"));
                  }, 2500);
                }),
              ]);
            } finally {
              if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
              }
            }

            if (tempRecords.size > 0) {
              for (const [docId, rawItem] of tempRecords.entries()) {
                const mapped = mapStrapiEntry
                  ? mapStrapiEntry(rawItem, lang)
                  : (rawItem as unknown as TItem);
                const slugOrId = String(mapped[idField] || docId);
                localizedItems.push({
                  ...mapped,
                  documentId: `${lang}:${slugOrId}`,
                  locale: lang,
                });
              }
              loadedFromStrapi = true;
            }
          } catch {
            offlineEndpoints.set(url, Date.now() + 10_000);
            logger.warn(
              `[${contentType}:${lang}] Strapi unreachable, falling back to localized mocks.`
            );
          }
        }

        if (!loadedFromStrapi) {
          const fallbackItems = fallbackByLocale(lang);
          for (const [index, item] of fallbackItems.entries()) {
            const slugOrId = String(
              item[idField] || `${contentType}-${String(index)}`
            );
            localizedItems.push({
              ...item,
              documentId: `${lang}:${slugOrId}`,
              locale: lang,
            });
          }
        }

        for (const entry of localizedItems) {
          const parsed = await context.parseData({
            id: entry.documentId,
            data: entry,
          });
          const digest = context.generateDigest(parsed);
          store.set({
            id: entry.documentId,
            data: parsed,
            digest,
          });
        }
      }
    },
  };
}

export const createStrapiCollectionLoader = createResilientStrapiLoader;

/**
 * Wraps `@sensinum/astro-strapi-loader` for Strapi v5 Single Types (e.g., `about-page`),
 * storing one localized entry (`${lang}:${contentType}`) per locale with offline mock fallback.
 */
export function createStrapiSingleTypeLoader<
  TItem extends Record<string, unknown>,
>(options: TStrapiSingleTypeLoaderOptions<TItem>): Loader {
  const { contentType, fallbackByLocale, mapStrapiEntry, ...rest } = options;

  return createResilientStrapiLoader<TItem & { slug: string }>({
    ...rest,
    contentType,
    idField: "slug",
    fallbackByLocale: (lang) => [
      {
        ...fallbackByLocale(lang),
        slug: contentType,
      },
    ],
    mapStrapiEntry: (raw, lang) => {
      const mapped = mapStrapiEntry
        ? mapStrapiEntry(raw, lang)
        : {
            ...fallbackByLocale(lang),
            ...raw,
          };
      return {
        ...mapped,
        slug: contentType,
      };
    },
  });
}
