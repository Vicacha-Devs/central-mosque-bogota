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
  'plugin::inbox.form',
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

function escapeXml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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
    const optionUid = 'plugin::strapi-5-sitemap-plugin.strapi-5-sitemap-plugin-option';
    const ctUid = 'plugin::strapi-5-sitemap-plugin.strapi-5-sitemap-plugin-content-type';
    const singleUrlUid =
      'plugin::strapi-5-sitemap-plugin.strapi-5-sitemap-plugin-content-type-single-url';

    if (!strapi.contentTypes?.[optionUid as keyof typeof strapi.contentTypes]) {
      return;
    }

    // 1. Enhance strapi-5-sitemap-plugin service so getContentTypes(), getAllowedFields(),
    // getSitemap(), and buildAndReturnSitemapXml() support all 16 public api::* and plugin::* collection types.
    const sitemapPlugin = strapi.plugin('strapi-5-sitemap-plugin') as unknown as {
      service?: (name: string) => Record<string, any> | undefined;
    };
    const sitemapSvc = sitemapPlugin?.service?.('service');
    if (sitemapSvc && typeof sitemapSvc === 'object') {
      sitemapSvc.getContentTypes = async () => {
        const allCts = (strapi.contentTypes || {}) as Record<string, any>;
        const collectionTypes = Object.keys(allCts)
          .filter(
            (key) =>
              allCts[key]?.kind === 'collectionType' &&
              (key.startsWith('api::') || SITEMAP_PUBLIC_PLUGIN_UIDS.has(key))
          )
          .map((key) => ({
            uid: key,
            singularName: allCts[key].info?.singularName || key,
            pluralName: allCts[key].info?.pluralName || key,
            displayName: String(allCts[key].info?.displayName || key).replace(/^\d{1,3}\s+/, ''),
          }));
        return { collectionTypes };
      };

      sitemapSvc.getAllowedFields = async (contentTypeSingularName: string) => {
        const systemFields = [
          'createdAt',
          'updatedAt',
          'publishedAt',
          'createdBy',
          'updatedBy',
          'locale',
        ];
        const uid = resolveSitemapContentTypeUid(strapi, contentTypeSingularName);
        const contentType = uid
          ? (strapi.contentTypes as Record<string, any>)[uid]
          : undefined;
        if (!contentType) {
          return { allowedFields: ['id', 'slug'], slug: contentTypeSingularName };
        }
        const fields: string[] = [];
        Object.entries(contentType.attributes || {}).forEach(
          ([fieldName, field]: [string, any]) => {
            if (
              !systemFields.includes(fieldName) &&
              field?.type !== 'relation' &&
              field?.type !== 'component'
            ) {
              fields.push(fieldName);
            } else if (
              field?.type === 'relation' &&
              typeof field?.relation === 'string' &&
              field.relation.endsWith('ToOne') &&
              !['createdBy', 'updatedBy'].includes(fieldName)
            ) {
              fields.push(`${fieldName}.id`);
            } else if (field?.type === 'component' && !field?.repeatable) {
              const component = (strapi.components as Record<string, any>)?.[
                field.component
              ];
              if (component?.attributes) {
                Object.keys(component.attributes).forEach((subFieldName) => {
                  fields.push(`${fieldName}.${subFieldName}`);
                });
              }
            }
          }
        );
        if (!fields.includes('id')) {
          fields.push('id');
        }
        return {
          allowedFields: fields,
          slug: contentType.info?.pluralName || contentTypeSingularName,
        };
      };

      sitemapSvc.getSitemap = async function (slug?: string) {
        const baseURLObject = await (strapi.documents as any)(optionUid).findFirst();
        if (!baseURLObject) return this.generateUrlsetXml([]);
        const baseURL = baseURLObject.baseUrl || '';
        const excludedUrls = Array.isArray(baseURLObject.excludedUrls)
          ? baseURLObject.excludedUrls
          : [];
        const useSitemapIndex = Boolean(baseURLObject.useSitemapIndex);
        const sitemapDefinitions = Array.isArray(baseURLObject.sitemapDefinitions)
          ? baseURLObject.sitemapDefinitions
          : [];
        const allSitemapEntries =
          (await strapi.db?.query?.(ctUid)?.findMany()) || [];
        const allCustomURLs =
          (await strapi.db?.query?.(singleUrlUid)?.findMany()) || [];

        if (slug !== undefined && sitemapDefinitions.length > 0) {
          const def = sitemapDefinitions.find(
            (d: Record<string, any>) =>
              String(d.name || '').trim() === String(slug).trim()
          );
          if (!def) return this.generateUrlsetXml([]);
          const configIds = Array.isArray(def.collectionTypeConfigIds)
            ? def.collectionTypeConfigIds
            : [];
          const sitemapEntries = allSitemapEntries.filter(
            (e: Record<string, any>) => configIds.includes(e.id)
          );
          const customURLs = def.includeCustomUrls ? allCustomURLs : [];
          return this.buildAndReturnSitemapXml(
            baseURL,
            excludedUrls,
            sitemapEntries,
            customURLs
          );
        }

        if (useSitemapIndex && sitemapDefinitions.length > 0) {
          return this.generateSitemapIndexXml(baseURL, sitemapDefinitions);
        }

        return this.buildAndReturnSitemapXml(
          baseURL,
          excludedUrls,
          allSitemapEntries,
          allCustomURLs
        );
      };

      sitemapSvc.buildAndReturnSitemapXml = async function (
        baseURL: string,
        excludedUrls: string[],
        sitemapEntries: Array<Record<string, any>>,
        customURLs: Array<Record<string, any>>
      ) {
        try {
          const collections: Array<Record<string, any>> = [];
          const sitemap: Array<Record<string, any>> = [];
          const normalizedBase = String(baseURL || '').replace(/\/$/, '');

          for (const sitemapEntry of sitemapEntries) {
            const uid = resolveSitemapContentTypeUid(strapi, sitemapEntry.type);
            if (!uid) continue;

            const ctSchema = (strapi.contentTypes as Record<string, any>)?.[uid];
            const isLocalized = Boolean(ctSchema?.pluginOptions?.i18n?.localized);
            const hasMediaAttr = Boolean(
              sitemapEntry.thumbnail &&
                sitemapEntry.thumbnail !== '-' &&
                ctSchema?.attributes?.[sitemapEntry.thumbnail]?.type === 'media'
            );

            let populate: Record<string, any> | undefined = hasMediaAttr
              ? { [sitemapEntry.thumbnail]: true }
              : undefined;

            if (sitemapEntry.populateLinkedModels === 'true') {
              const linkedModels = this.parseTableReferences(sitemapEntry.pattern);
              if (linkedModels?.populate) {
                populate = {
                  ...(populate || {}),
                  ...linkedModels.populate,
                };
              }
            }

            let entries: Array<Record<string, any>> = [];
            try {
              entries =
                (await (strapi.documents as any)(uid).findMany({
                  locale:
                    isLocalized && sitemapEntry.langcode !== '-'
                      ? sitemapEntry.langcode
                      : undefined,
                  status: 'published',
                  populate,
                })) || [];
            } catch {
              entries = [];
            }

            if (entries.length === 0 && strapi.db?.query) {
              try {
                const where: Record<string, any> = {};
                if (isLocalized && sitemapEntry.langcode !== '-') {
                  where.locale = sitemapEntry.langcode;
                }
                entries = (await strapi.db.query(uid).findMany({ where })) || [];
              } catch {
                entries = [];
              }
            }

            collections.push({ ...sitemapEntry, entries });
          }

          for (const collection of collections) {
            const {
              pattern,
              priority,
              frequency,
              entries,
              lastModified,
              thumbnail,
              populateLinkedModels,
            } = collection;

            for (const entry of entries || []) {
              let url = String(pattern || '');
              const placeholders = url.match(/\[([^\]]+)]/g) || [];
              let hasInvalidPlaceholder = false;

              for (const placeholder of placeholders) {
                const key = placeholder.replace(/[\[\]]/g, '');
                const value = key.includes('.')
                  ? this.getNestedValue(entry, key)
                  : entry[key];

                if (value !== null && value !== undefined && String(value) !== '') {
                  url = url.replace(placeholder, String(value));
                } else if (key.includes('.')) {
                  url = url.replace(placeholder, '');
                } else {
                  hasInvalidPlaceholder = true;
                  break;
                }
              }

              if (hasInvalidPlaceholder) continue;

              url = url.replace(/\/+/g, '/');
              const fullUrl = `${normalizedBase}${url.startsWith('/') ? url : `/${url}`}`;

              const item: Record<string, any> = {
                url: escapeXml(fullUrl),
                priority,
                frequency,
                lastmod:
                  lastModified === 'true' && entry.updatedAt
                    ? escapeXml(String(entry.updatedAt))
                    : undefined,
                thumbnail: undefined,
                thumbnailTitle: undefined,
                populateLinkedModels:
                  populateLinkedModels === 'true' ? true : undefined,
              };

              if (thumbnail && thumbnail !== '-') {
                const media = Array.isArray(entry[thumbnail])
                  ? entry[thumbnail][0]
                  : entry[thumbnail];
                const rawMediaUrl =
                  media?.url ||
                  entry.imageUrl ||
                  entry.coverUrl ||
                  entry.photoUrl ||
                  entry.coverImageUrl ||
                  entry.posterUrl ||
                  entry.thumbnailUrl;
                if (typeof rawMediaUrl === 'string' && rawMediaUrl.trim()) {
                  const resolvedThumbUrl = rawMediaUrl.startsWith('http')
                    ? rawMediaUrl.trim()
                    : `${normalizedBase}${rawMediaUrl.startsWith('/') ? '' : '/'}${rawMediaUrl.trim()}`;
                  item.thumbnail = escapeXml(resolvedThumbUrl);
                  const rawTitle =
                    media?.name ||
                    entry.title ||
                    entry.name ||
                    entry.term ||
                    entry.slug ||
                    '';
                  item.thumbnailTitle = escapeXml(String(rawTitle));
                }
              }

              sitemap.push(item);
            }
          }

          for (const customURL of customURLs || []) {
            const slugPath = String(customURL.slug || '');
            const fullUrl = `${normalizedBase}${slugPath.startsWith('/') ? slugPath : `/${slugPath}`}`;
            sitemap.push({
              url: escapeXml(fullUrl),
              priority: customURL.priority,
              frequency: customURL.frequency,
            });
          }

          const normalizedExcluded = (excludedUrls || [])
            .map((path) => String(path).trim())
            .filter(Boolean)
            .map((p) => (p.startsWith('/') ? p : `/${p}`).replace(/\/$/, '') || '/');

          const getPathFromUrl = (rawUrl: string) => {
            try {
              const pathname = new URL(rawUrl).pathname;
              return pathname.replace(/\/$/, '') || '/';
            } catch {
              return '/';
            }
          };

          const filteredSitemap = sitemap.filter((entry) => {
            const path = getPathFromUrl(entry.url);
            return !normalizedExcluded.some((ex) => path === ex);
          });

          return this.generateUrlsetXml(filteredSitemap);
        } catch (error) {
          strapi.log?.error?.('Error fetching entries:', error);
          throw new Error('Failed to fetch entries for types');
        }
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

    // 2. Seed and normalize all 49 collection type mappings in strapi_5_sitemap_plugin_content_types
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
