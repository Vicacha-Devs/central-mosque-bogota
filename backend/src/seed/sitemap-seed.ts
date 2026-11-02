import type { Core } from '@strapi/strapi';

export const SITEMAP_PUBLIC_PLUGIN_UIDS = new Set([
  'plugin::events.event',
  'plugin::bookings.resource',
  'plugin::islam.scripture-entry',
  'plugin::islam.hilal-announcement',
  'plugin::donations.campaign',
  'plugin::certificates.template',
  'plugin::media-feeds.media-item',
  'plugin::media-feeds.media-series',
  'plugin::resources.publication',
  'plugin::resources.gallery-album',
  'plugin::resources.glossary-term',
  'plugin::strapi-plugin-form-builder-cms.form',
]);

export interface SitemapCollectionConfig {
  type: string;
  localized: boolean;
  pattern: string;
  priority: number;
  frequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastModified: 'true' | 'false';
  thumbnail: string;
  populateLinkedModels: 'true' | 'false';
  sitemapGroup:
    | 'pages'
    | 'editorial-and-library'
    | 'events-and-liturgy'
    | 'community-and-donations'
    | 'media-and-podcasts';
}

export const SITEMAP_COLLECTION_CONFIGS: SitemapCollectionConfig[] = [
  // Editorial & Library
  {
    type: 'article',
    localized: true,
    pattern: '/[locale]/articles/[slug]',
    priority: 0.8,
    frequency: 'weekly',
    lastModified: 'true',
    thumbnail: 'image',
    populateLinkedModels: 'false',
    sitemapGroup: 'editorial-and-library',
  },
  {
    type: 'publication',
    localized: true,
    pattern: '/[locale]/islam-and-faith#publication-[slug]',
    priority: 0.8,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: 'coverImage',
    populateLinkedModels: 'false',
    sitemapGroup: 'editorial-and-library',
  },
  {
    type: 'glossary-term',
    localized: true,
    pattern: '/[locale]/islam-and-faith#glossary-[slug]',
    priority: 0.7,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: '-',
    populateLinkedModels: 'false',
    sitemapGroup: 'editorial-and-library',
  },
  {
    type: 'scripture-entry',
    localized: false,
    pattern: '/es/islam-and-faith#scripture-[slug]',
    priority: 0.8,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: '-',
    populateLinkedModels: 'false',
    sitemapGroup: 'editorial-and-library',
  },
  // Events, Scheduling & Liturgy
  {
    type: 'event',
    localized: true,
    pattern: '/[locale]/events/[slug]',
    priority: 0.9,
    frequency: 'daily',
    lastModified: 'true',
    thumbnail: 'poster',
    populateLinkedModels: 'false',
    sitemapGroup: 'events-and-liturgy',
  },
  {
    type: 'hilal-announcement',
    localized: false,
    pattern: '/es/prayer-information#hilal-[hijriYear]-[hijriMonth]',
    priority: 0.8,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: '-',
    populateLinkedModels: 'false',
    sitemapGroup: 'events-and-liturgy',
  },
  {
    type: 'resource',
    localized: false,
    pattern: '/es/contact-and-visit#booking-[slug]',
    priority: 0.8,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: '-',
    populateLinkedModels: 'false',
    sitemapGroup: 'events-and-liturgy',
  },
  // Community Services, Donations, Certificates & Forms
  {
    type: 'community-service',
    localized: true,
    pattern: '/[locale]/community-services#[slug]',
    priority: 0.8,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: 'image',
    populateLinkedModels: 'false',
    sitemapGroup: 'community-and-donations',
  },
  {
    type: 'campaign',
    localized: true,
    pattern: '/[locale]/donate#[slug]',
    priority: 0.9,
    frequency: 'weekly',
    lastModified: 'true',
    thumbnail: '-',
    populateLinkedModels: 'false',
    sitemapGroup: 'community-and-donations',
  },
  {
    type: 'template',
    localized: false,
    pattern: '/es/community-services#certificate-[slug]',
    priority: 0.7,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: '-',
    populateLinkedModels: 'false',
    sitemapGroup: 'community-and-donations',
  },
  {
    type: 'form',
    localized: false,
    pattern: '/es/contact-and-visit#form-[slug]',
    priority: 0.7,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: '-',
    populateLinkedModels: 'false',
    sitemapGroup: 'community-and-donations',
  },
  // Media & Podcasts
  {
    type: 'media-item',
    localized: true,
    pattern: '/[locale]/media#[slug]',
    priority: 0.8,
    frequency: 'weekly',
    lastModified: 'true',
    thumbnail: 'thumbnail',
    populateLinkedModels: 'false',
    sitemapGroup: 'media-and-podcasts',
  },
  {
    type: 'media-series',
    localized: true,
    pattern: '/[locale]/media#series-[slug]',
    priority: 0.7,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: '-',
    populateLinkedModels: 'false',
    sitemapGroup: 'media-and-podcasts',
  },
  // About Us & Institutional Sections (Leaders, FAQs, Galleries)
  {
    type: 'gallery-album',
    localized: true,
    pattern: '/[locale]/about-us#gallery-[slug]',
    priority: 0.7,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: 'coverPhoto',
    populateLinkedModels: 'false',
    sitemapGroup: 'pages',
  },
  {
    type: 'leader',
    localized: true,
    pattern: '/[locale]/about-us#leader-[id]',
    priority: 0.7,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: 'photo',
    populateLinkedModels: 'false',
    sitemapGroup: 'pages',
  },
  {
    type: 'faq',
    localized: true,
    pattern: '/[locale]/about-us#faq-[id]',
    priority: 0.7,
    frequency: 'monthly',
    lastModified: 'true',
    thumbnail: '-',
    populateLinkedModels: 'false',
    sitemapGroup: 'pages',
  },
];

export const SITEMAP_CORE_ROUTES: Array<{
  suffix: string;
  priority: number;
  frequency: 'daily' | 'weekly' | 'monthly';
}> = [
  { suffix: '', priority: 1.0, frequency: 'daily' },
  { suffix: '/about-us', priority: 0.9, frequency: 'monthly' },
  { suffix: '/islam-and-faith', priority: 0.9, frequency: 'weekly' },
  { suffix: '/prayer-information', priority: 0.9, frequency: 'daily' },
  { suffix: '/events-and-programs', priority: 0.9, frequency: 'daily' },
  { suffix: '/community-services', priority: 0.8, frequency: 'monthly' },
  { suffix: '/media', priority: 0.8, frequency: 'weekly' },
  { suffix: '/donate', priority: 0.9, frequency: 'weekly' },
  { suffix: '/contact-and-visit', priority: 0.8, frequency: 'monthly' },
  { suffix: '/search', priority: 0.6, frequency: 'weekly' },
];

export function resolveSitemapContentTypeUid(
  strapi: Core.Strapi,
  typeOrUid: string
): string | undefined {
  const allCts = (strapi.contentTypes || {}) as Record<string, any>;
  if (allCts[typeOrUid]) {
    return typeOrUid;
  }

  // First check public api::* and SITEMAP_PUBLIC_PLUGIN_UIDS so 'campaign' resolves to plugin::donations.campaign
  for (const [uid, schema] of Object.entries(allCts)) {
    if (
      schema?.kind === 'collectionType' &&
      (uid.startsWith('api::') || SITEMAP_PUBLIC_PLUGIN_UIDS.has(uid)) &&
      schema?.info?.singularName === typeOrUid
    ) {
      return uid;
    }
  }

  for (const [uid, schema] of Object.entries(allCts)) {
    if (schema?.info?.singularName === typeOrUid) {
      return uid;
    }
  }

  const candidateApiUid = `api::${typeOrUid}.${typeOrUid}`;
  return allCts[candidateApiUid] ? candidateApiUid : undefined;
}

export async function seedSitemapPluginConfig(strapi: Core.Strapi) {
  try {
    const optionUid = 'plugin::sitemap.sitemap-option';
    const ctUid = 'plugin::sitemap.sitemap-content-type';
    const singleUrlUid = 'plugin::sitemap.sitemap-content-type-single-url';

    if (!strapi.contentTypes?.[optionUid as keyof typeof strapi.contentTypes]) {
      return;
    }

    // 1. Configure @vicacha-devs/strapi-plugin-sitemap service so getContentTypes() and
    // resolveContentTypeUid() scope to the 16 public api::* and plugin::* collection types.
    const sitemapPlugin = strapi.plugin('sitemap') as unknown as {
      service?: (name: string) => Record<string, any> | undefined;
    };
    const sitemapSvc = sitemapPlugin?.service?.('service');
    if (sitemapSvc && typeof sitemapSvc === 'object') {
      sitemapSvc.resolveContentTypeUid = (typeName: string) =>
        resolveSitemapContentTypeUid(strapi, typeName);

      sitemapSvc.getContentTypes = async () => {
        const allCts = (strapi.contentTypes || {}) as Record<string, any>;
        const collectionTypes = Object.keys(allCts)
          .filter(
            (key) =>
              allCts[key]?.kind === 'collectionType' &&
              (key.startsWith('api::') || SITEMAP_PUBLIC_PLUGIN_UIDS.has(key))
          )
          .map((key) => {
            const displayName = String(allCts[key].info?.displayName || key).replace(
              /^\d{1,3}\s+/,
              ''
            );
            const singularName = allCts[key].info?.singularName || key;
            const pluralName = allCts[key].info?.pluralName || key;
            return {
              uid: key,
              singularName,
              pluralName,
              displayName,
              info: {
                singularName,
                pluralName,
                displayName,
              },
            };
          });
        return { collectionTypes };
      };
    }

    const docFn = (strapi as unknown as {
      documents?: (uid: string) => {
        findFirst?: (opts?: Record<string, unknown>) => Promise<Record<string, any> | null>;
        findMany?: (opts?: Record<string, unknown>) => Promise<Array<Record<string, any>>>;
        create: (opts: { data: Record<string, unknown> }) => Promise<unknown>;
        update: (opts: { documentId: string; data: Record<string, unknown> }) => Promise<unknown>;
      };
    }).documents;
    if (typeof docFn !== 'function') return;

    const locales = ['es', 'en', 'ar', 'tr'];
    const ctQuery = strapi.db?.query?.(ctUid);

    // 2. Seed and normalize all 49 collection type mappings in sitemap_content_types
    if (ctQuery) {
      const existingCtMappings: Array<Record<string, any>> =
        (await ctQuery.findMany()) || [];

      for (const item of SITEMAP_COLLECTION_CONFIGS) {
        const targetLangcodes = item.localized ? locales : ['-'];
        for (const langcode of targetLangcodes) {
          const desiredPattern = item.localized
            ? item.pattern.replace('[locale]', langcode)
            : item.pattern;
          const match = existingCtMappings.find(
            (r) =>
              r.type === item.type &&
              (item.localized ? r.langcode === langcode : true)
          );

          if (!match) {
            await ctQuery.create({
              data: {
                type: item.type,
                langcode,
                pattern: desiredPattern,
                priority: item.priority,
                frequency: item.frequency,
                lastModified: item.lastModified,
                thumbnail: item.thumbnail,
                populateLinkedModels: item.populateLinkedModels,
              },
            });
          } else if (
            match.langcode !== langcode ||
            match.pattern !== desiredPattern ||
            match.thumbnail !== item.thumbnail ||
            Number(match.priority) !== item.priority ||
            match.frequency !== item.frequency ||
            match.lastModified !== item.lastModified ||
            match.populateLinkedModels !== item.populateLinkedModels
          ) {
            await ctQuery.update({
              where: { id: match.id },
              data: {
                langcode,
                pattern: desiredPattern,
                priority: item.priority,
                frequency: item.frequency,
                lastModified: item.lastModified,
                thumbnail: item.thumbnail,
                populateLinkedModels: item.populateLinkedModels,
              },
            });
          }
        }
      }
    }

    // 3. Seed and normalize all 40 Custom URLs in strapi_5_sitemap_plugin_content_type_single_url
    const singleUrlService = docFn(singleUrlUid);
    const singleUrlQuery = strapi.db?.query?.(singleUrlUid);
    const existingSingleUrls = singleUrlService.findMany
      ? await singleUrlService.findMany()
      : [];
    const existingBySlug = new Map<string, Record<string, any>>();
    for (const u of existingSingleUrls || []) {
      if (u?.slug) {
        existingBySlug.set(String(u.slug), u);
      }
    }

    for (const lang of locales) {
      for (const r of SITEMAP_CORE_ROUTES) {
        const slug = `/${lang}${r.suffix}`;
        const existing = existingBySlug.get(slug);
        if (!existing) {
          await singleUrlService.create({
            data: {
              slug,
              priority: r.priority,
              frequency: r.frequency,
            },
          });
        } else if (
          singleUrlQuery &&
          existing.id &&
          (Number(existing.priority) !== r.priority ||
            existing.frequency !== r.frequency)
        ) {
          await singleUrlQuery.update({
            where: { id: existing.id },
            data: {
              slug,
              priority: r.priority,
              frequency: r.frequency,
            },
          });
        }
      }
    }

    // 4. Seed and update Sitemap Options (baseUrl, excludedUrls, and structured sitemapDefinitions)
    const baseUrl = process.env.PUBLIC_SITE_URL || 'https://mezquitabogota.org';
    const desiredExcludedUrls = ['/admin', '/api', '/404'];
    const allCtRows: Array<Record<string, any>> = ctQuery
      ? (await ctQuery.findMany()) || []
      : [];

    const groupTypeMap = new Map<string, SitemapCollectionConfig['sitemapGroup']>();
    for (const cfg of SITEMAP_COLLECTION_CONFIGS) {
      groupTypeMap.set(cfg.type, cfg.sitemapGroup);
    }

    const idsForGroup = (group: SitemapCollectionConfig['sitemapGroup']): number[] =>
      allCtRows
        .filter((row) => groupTypeMap.get(row.type) === group && typeof row.id === 'number')
        .map((row) => row.id as number);

    const desiredSitemapDefinitions = [
      {
        name: 'pages',
        includeCustomUrls: true,
        collectionTypeConfigIds: idsForGroup('pages'),
      },
      {
        name: 'editorial-and-library',
        includeCustomUrls: false,
        collectionTypeConfigIds: idsForGroup('editorial-and-library'),
      },
      {
        name: 'events-and-liturgy',
        includeCustomUrls: false,
        collectionTypeConfigIds: idsForGroup('events-and-liturgy'),
      },
      {
        name: 'community-and-donations',
        includeCustomUrls: false,
        collectionTypeConfigIds: idsForGroup('community-and-donations'),
      },
      {
        name: 'media-and-podcasts',
        includeCustomUrls: false,
        collectionTypeConfigIds: idsForGroup('media-and-podcasts'),
      },
    ];

    const optionService = docFn(optionUid);
    const optionQuery = strapi.db?.query?.(optionUid);
    const existingOption = optionService.findFirst
      ? await optionService.findFirst()
      : null;

    if (!existingOption) {
      await optionService.create({
        data: {
          baseUrl,
          excludedUrls: desiredExcludedUrls,
          useSitemapIndex: false,
          sitemapDefinitions: desiredSitemapDefinitions,
        },
      });
    } else {
      const currentDefs = Array.isArray(existingOption.sitemapDefinitions)
        ? existingOption.sitemapDefinitions
        : [];
      const currentTotalMappedIds = currentDefs.reduce(
        (acc: number, d: Record<string, any>) =>
          acc + (Array.isArray(d?.collectionTypeConfigIds) ? d.collectionTypeConfigIds.length : 0),
        0
      );
      const needsUpdate =
        !existingOption.baseUrl ||
        !Array.isArray(existingOption.excludedUrls) ||
        existingOption.excludedUrls.length === 0 ||
        currentDefs.length === 0 ||
        currentTotalMappedIds < allCtRows.length;

      if (needsUpdate) {
        const updatePayload = {
          baseUrl: existingOption.baseUrl || baseUrl,
          excludedUrls:
            Array.isArray(existingOption.excludedUrls) &&
            existingOption.excludedUrls.length > 0
              ? existingOption.excludedUrls
              : desiredExcludedUrls,
          useSitemapIndex: Boolean(existingOption.useSitemapIndex),
          sitemapDefinitions:
            currentDefs.length === 0 || currentTotalMappedIds < allCtRows.length
              ? desiredSitemapDefinitions
              : currentDefs,
        };

        if (optionQuery && existingOption.id) {
          await optionQuery.update({
            where: { id: existingOption.id },
            data: updatePayload,
          });
        } else if (existingOption.documentId) {
          await optionService.update({
            documentId: existingOption.documentId,
            data: updatePayload,
          });
        }
      }
    }
  } catch {
    // Resilient fallback in test mocks
  }
}
