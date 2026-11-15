import type { Core } from '@strapi/strapi';

export const NAVIGATION_DESIRED_CONTENT_TYPES = [
  'api::about-page.about-page',
  'api::islam-faith-page.islam-faith-page',
  'api::donations-page.donations-page',
  'api::contact-page.contact-page',
  'api::article.article',
  'api::community-service.community-service',
  'api::leader.leader',
  'api::faq.faq',
  'plugin::events.event',
  'plugin::donations.campaign',
  'plugin::media-feeds.media-item',
  'plugin::media-feeds.media-series',
  'plugin::resources.publication',
  'plugin::resources.gallery-album',
  'plugin::resources.glossary-term',
  'plugin::bookings.resource',
];

export const NAVIGATION_CONTENT_TYPES_NAME_FIELDS: Record<string, string[]> = {
  default: ['title', 'name', 'heroTitle', 'question', 'term'],
  'api::about-page.about-page': ['heroTitle'],
  'api::islam-faith-page.islam-faith-page': ['heroTitle'],
  'api::donations-page.donations-page': ['heroTitle'],
  'api::contact-page.contact-page': ['heroTitle'],
  'api::article.article': ['title'],
  'api::community-service.community-service': ['title'],
  'api::leader.leader': ['name'],
  'api::faq.faq': ['question'],
  'plugin::events.event': ['title'],
  'plugin::donations.campaign': ['title'],
  'plugin::media-feeds.media-item': ['title'],
  'plugin::media-feeds.media-series': ['title'],
  'plugin::resources.publication': ['title'],
  'plugin::resources.gallery-album': ['title'],
  'plugin::resources.glossary-term': ['term'],
  'plugin::bookings.resource': ['name'],
};

export const NAVIGATION_PATH_DEFAULT_FIELDS: Record<string, string[]> = {
  'api::article.article': ['slug'],
  'api::community-service.community-service': ['slug'],
  'api::leader.leader': ['id'],
  'api::faq.faq': ['id'],
  'plugin::events.event': ['slug'],
  'plugin::donations.campaign': ['slug'],
  'plugin::media-feeds.media-item': ['slug'],
  'plugin::media-feeds.media-series': ['slug'],
  'plugin::resources.publication': ['slug'],
  'plugin::resources.gallery-album': ['slug'],
  'plugin::resources.glossary-term': ['slug'],
  'plugin::bookings.resource': ['slug'],
};

interface NavLocaleLabels {
  aboutUs: string;
  leadership: string;
  faq: string;
  islamFaith: string;
  prayerInfo: string;
  eventsPrograms: string;
  communityServices: string;
  mediaPodcasts: string;
  donateZakat: string;
  contactVisit: string;
  footerWorshipGroup: string;
  footerCommunityGroup: string;
  footerInstitutionGroup: string;
  search: string;
  publications: string;
}

const NAV_LABELS_BY_LOCALE: Record<string, NavLocaleLabels> = {
  es: {
    aboutUs: 'Nosotros',
    leadership: 'Liderazgo e Imames',
    faq: 'Preguntas Frecuentes (FAQ)',
    islamFaith: 'Islam y Fe',
    prayerInfo: 'Horarios de Oración',
    eventsPrograms: 'Eventos y Programas',
    communityServices: 'Servicios Comunitarios',
    mediaPodcasts: 'Medios y Khutbahs',
    donateZakat: 'Donar y Zakat',
    contactVisit: 'Contacto y Visitas',
    footerWorshipGroup: 'Oración, Fe y Educación',
    footerCommunityGroup: 'Comunidad, Servicios y Zakat',
    footerInstitutionGroup: 'Institución y Visitas Guiadas',
    search: 'Buscador Global',
    publications: 'Biblioteca y Publicaciones',
  },
  en: {
    aboutUs: 'About Us',
    leadership: 'Leadership & Imams',
    faq: 'Frequently Asked Questions (FAQ)',
    islamFaith: 'Islam & Faith',
    prayerInfo: 'Prayer Information',
    eventsPrograms: 'Events & Programs',
    communityServices: 'Community Services',
    mediaPodcasts: 'Media & Podcasts',
    donateZakat: 'Donate & Zakat',
    contactVisit: 'Contact & Visit',
    footerWorshipGroup: 'Prayer, Faith & Education',
    footerCommunityGroup: 'Community, Services & Zakat',
    footerInstitutionGroup: 'Institution & Guided Visits',
    search: 'Global Search',
    publications: 'Library & Publications',
  },
  ar: {
    aboutUs: 'عن المسجد',
    leadership: 'الأئمة والقيادة الدينية',
    faq: 'الأسئلة الشائعة',
    islamFaith: 'الإسلام والإيمان',
    prayerInfo: 'مواقيت الصلاة',
    eventsPrograms: 'الفعاليات والبرامج',
    communityServices: 'الخدمات المجتمعية',
    mediaPodcasts: 'المرئيات وخطب الجمعة',
    donateZakat: 'التبرع والزكاة',
    contactVisit: 'تواصل وزيارة المسجد',
    footerWorshipGroup: 'الصلاة والعقيدة والتعليم',
    footerCommunityGroup: 'المجتمع والخدمات والزكاة',
    footerInstitutionGroup: 'المؤسسة والزيارات التعريفية',
    search: 'البحث الشامل',
    publications: 'المكتبة والإصدارات',
  },
  tr: {
    aboutUs: 'Hakkımızda',
    leadership: 'İmamlar ve Yönetim',
    faq: 'Sıkça Sorulan Sorular (SSS)',
    islamFaith: 'İslam ve İman',
    prayerInfo: 'Namaz Vakitleri',
    eventsPrograms: 'Etkinlikler ve Programlar',
    communityServices: 'Toplum Hizmetleri',
    mediaPodcasts: 'Medya ve Hutbeler',
    donateZakat: 'Bağış ve Zekât',
    contactVisit: 'İletişim ve Ziyaret',
    footerWorshipGroup: 'Namaz, İman ve Eğitim',
    footerCommunityGroup: 'Toplum, Hizmetler ve Zekât',
    footerInstitutionGroup: 'Kurumsal ve Rehberli Ziyaret',
    search: 'Genel Arama',
    publications: 'Kütüphane ve Yayınlar',
  },
};

interface SeedNavItem {
  title: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'WRAPPER';
  path: string;
  externalPath?: string;
  uiRouterKey: string;
  menuAttached: boolean;
  order: number;
  collapsed: boolean;
  autoSync: boolean;
  related?: {
    __type: string;
    documentId: string;
  };
  additionalFields: Record<string, unknown>;
  items: SeedNavItem[];
}

async function findPublishedDocs(
  strapi: Core.Strapi,
  uid: string,
  locale: string,
  limit = 3
): Promise<Array<Record<string, any>>> {
  try {
    const docFn = (strapi as unknown as {
      documents?: (modelUid: string) => {
        findMany?: (opts?: Record<string, unknown>) => Promise<Array<Record<string, any>>>;
      };
    }).documents;
    if (typeof docFn !== 'function') return [];
    const svc = docFn(uid);
    if (!svc?.findMany) return [];
    const published = await svc.findMany({
      locale,
      status: 'published',
      limit,
    });
    if (Array.isArray(published) && published.length > 0) {
      return published;
    }
    const fallback = await svc.findMany({ locale, limit });
    return Array.isArray(fallback) ? fallback : [];
  } catch {
    return [];
  }
}

async function findSingleDoc(
  strapi: Core.Strapi,
  uid: string,
  locale: string
): Promise<Record<string, any> | null> {
  const docs = await findPublishedDocs(strapi, uid, locale, 1);
  return docs[0] ?? null;
}

function makeNavItem(opts: {
  title: string;
  path: string;
  uiRouterKey: string;
  order: number;
  iconName: string;
  relatedUid?: string;
  relatedDocId?: string;
  items?: SeedNavItem[];
}): SeedNavItem {
  const hasRelated = Boolean(opts.relatedUid && opts.relatedDocId);
  return {
    title: opts.title,
    type: hasRelated ? 'INTERNAL' : 'WRAPPER',
    path: opts.path,
    uiRouterKey: opts.uiRouterKey,
    menuAttached: true,
    order: opts.order,
    collapsed: false,
    autoSync: false,
    ...(hasRelated
      ? {
          related: {
            __type: opts.relatedUid!,
            documentId: opts.relatedDocId!,
          },
        }
      : {}),
    additionalFields: {
      icon_name: opts.iconName,
    },
    items: opts.items ?? [],
  };
}

async function buildHeaderNavItemsForLocale(
  strapi: Core.Strapi,
  locale: string
): Promise<SeedNavItem[]> {
  const labels = NAV_LABELS_BY_LOCALE[locale] || NAV_LABELS_BY_LOCALE.es;

  const [
    aboutDoc,
    islamDoc,
    donationsDoc,
    contactDoc,
    leaders,
    faqs,
    articles,
    events,
    services,
    mediaItems,
    campaigns,
  ] = await Promise.all([
    findSingleDoc(strapi, 'api::about-page.about-page', locale),
    findSingleDoc(strapi, 'api::islam-faith-page.islam-faith-page', locale),
    findSingleDoc(strapi, 'api::donations-page.donations-page', locale),
    findSingleDoc(strapi, 'api::contact-page.contact-page', locale),
    findPublishedDocs(strapi, 'api::leader.leader', locale, 2),
    findPublishedDocs(strapi, 'api::faq.faq', locale, 1),
    findPublishedDocs(strapi, 'api::article.article', locale, 3),
    findPublishedDocs(strapi, 'plugin::events.event', locale, 3),
    findPublishedDocs(strapi, 'api::community-service.community-service', locale, 3),
    findPublishedDocs(strapi, 'plugin::media-feeds.media-item', locale, 2),
    findPublishedDocs(strapi, 'plugin::donations.campaign', locale, 2),
  ]);

  const aboutChildren: SeedNavItem[] = [];
  if (leaders[0]?.documentId) {
    aboutChildren.push(
      makeNavItem({
        title: labels.leadership,
        path: 'leadership',
        uiRouterKey: 'leadership',
        order: 1,
        iconName: 'groups',
        relatedUid: 'api::leader.leader',
        relatedDocId: String(leaders[0].documentId),
      })
    );
  }
  if (faqs[0]?.documentId) {
    aboutChildren.push(
      makeNavItem({
        title: labels.faq,
        path: 'faq',
        uiRouterKey: 'faq',
        order: aboutChildren.length + 1,
        iconName: 'help',
        relatedUid: 'api::faq.faq',
        relatedDocId: String(faqs[0].documentId),
      })
    );
  }

  const islamChildren: SeedNavItem[] = articles.map((art, idx) =>
    makeNavItem({
      title: String(art.title || `Article ${idx + 1}`),
      path: String(art.slug || `article-${idx + 1}`),
      uiRouterKey: String(art.slug || `article-${idx + 1}`),
      order: idx + 1,
      iconName: 'school',
      relatedUid: 'api::article.article',
      relatedDocId: String(art.documentId),
    })
  );

  const eventChildren: SeedNavItem[] = events.map((ev, idx) =>
    makeNavItem({
      title: String(ev.title || `Event ${idx + 1}`),
      path: String(ev.slug || `event-${idx + 1}`),
      uiRouterKey: String(ev.slug || `event-${idx + 1}`),
      order: idx + 1,
      iconName: 'event',
      relatedUid: 'plugin::events.event',
      relatedDocId: String(ev.documentId),
    })
  );

  const serviceChildren: SeedNavItem[] = services.map((svc, idx) =>
    makeNavItem({
      title: String(svc.title || `Service ${idx + 1}`),
      path: String(svc.slug || `service-${idx + 1}`),
      uiRouterKey: String(svc.slug || `service-${idx + 1}`),
      order: idx + 1,
      iconName: 'handshake',
      relatedUid: 'api::community-service.community-service',
      relatedDocId: String(svc.documentId),
    })
  );

  const mediaChildren: SeedNavItem[] = mediaItems.map((m, idx) =>
    makeNavItem({
      title: String(m.title || `Media ${idx + 1}`),
      path: String(m.slug || `media-${idx + 1}`),
      uiRouterKey: String(m.slug || `media-${idx + 1}`),
      order: idx + 1,
      iconName: 'play_circle',
      relatedUid: 'plugin::media-feeds.media-item',
      relatedDocId: String(m.documentId),
    })
  );

  const donateChildren: SeedNavItem[] = campaigns.map((camp, idx) =>
    makeNavItem({
      title: String(camp.title || `Campaign ${idx + 1}`),
      path: String(camp.slug || `campaign-${idx + 1}`),
      uiRouterKey: String(camp.slug || `campaign-${idx + 1}`),
      order: idx + 1,
      iconName: 'volunteer_activism',
      relatedUid: 'plugin::donations.campaign',
      relatedDocId: String(camp.documentId),
    })
  );

  return [
    makeNavItem({
      title: labels.aboutUs,
      path: 'about-us',
      uiRouterKey: 'about-us',
      order: 1,
      iconName: 'mosque',
      relatedUid: aboutDoc?.documentId ? 'api::about-page.about-page' : undefined,
      relatedDocId: aboutDoc?.documentId ? String(aboutDoc.documentId) : undefined,
      items: aboutChildren,
    }),
    makeNavItem({
      title: labels.islamFaith,
      path: 'islam-and-faith',
      uiRouterKey: 'islam-and-faith',
      order: 2,
      iconName: 'menu_book',
      relatedUid: islamDoc?.documentId ? 'api::islam-faith-page.islam-faith-page' : undefined,
      relatedDocId: islamDoc?.documentId ? String(islamDoc.documentId) : undefined,
      items: islamChildren,
    }),
    makeNavItem({
      title: labels.prayerInfo,
      path: 'prayer-information',
      uiRouterKey: 'prayer-information',
      order: 3,
      iconName: 'schedule',
    }),
    makeNavItem({
      title: labels.eventsPrograms,
      path: 'events-and-programs',
      uiRouterKey: 'events-and-programs',
      order: 4,
      iconName: 'calendar_month',
      items: eventChildren,
    }),
    makeNavItem({
      title: labels.communityServices,
      path: 'community-services',
      uiRouterKey: 'community-services',
      order: 5,
      iconName: 'volunteer_activism',
      items: serviceChildren,
    }),
    makeNavItem({
      title: labels.mediaPodcasts,
      path: 'media',
      uiRouterKey: 'media',
      order: 6,
      iconName: 'podcasts',
      items: mediaChildren,
    }),
    makeNavItem({
      title: labels.donateZakat,
      path: 'donate',
      uiRouterKey: 'donate',
      order: 7,
      iconName: 'favorite',
      relatedUid: donationsDoc?.documentId ? 'api::donations-page.donations-page' : undefined,
      relatedDocId: donationsDoc?.documentId ? String(donationsDoc.documentId) : undefined,
      items: donateChildren,
    }),
    makeNavItem({
      title: labels.contactVisit,
      path: 'contact-and-visit',
      uiRouterKey: 'contact-and-visit',
      order: 8,
      iconName: 'location_on',
      relatedUid: contactDoc?.documentId ? 'api::contact-page.contact-page' : undefined,
      relatedDocId: contactDoc?.documentId ? String(contactDoc.documentId) : undefined,
    }),
  ];
}

async function buildFooterNavItemsForLocale(
  strapi: Core.Strapi,
  locale: string
): Promise<SeedNavItem[]> {
  const labels = NAV_LABELS_BY_LOCALE[locale] || NAV_LABELS_BY_LOCALE.es;

  const [
    aboutDoc,
    islamDoc,
    donationsDoc,
    contactDoc,
    faqs,
    services,
    publications,
  ] = await Promise.all([
    findSingleDoc(strapi, 'api::about-page.about-page', locale),
    findSingleDoc(strapi, 'api::islam-faith-page.islam-faith-page', locale),
    findSingleDoc(strapi, 'api::donations-page.donations-page', locale),
    findSingleDoc(strapi, 'api::contact-page.contact-page', locale),
    findPublishedDocs(strapi, 'api::faq.faq', locale, 1),
    findPublishedDocs(strapi, 'api::community-service.community-service', locale, 2),
    findPublishedDocs(strapi, 'plugin::resources.publication', locale, 1),
  ]);

  const worshipChildren: SeedNavItem[] = [
    makeNavItem({
      title: labels.prayerInfo,
      path: 'prayer-information',
      uiRouterKey: 'prayer-information',
      order: 1,
      iconName: 'schedule',
    }),
    makeNavItem({
      title: labels.islamFaith,
      path: 'islam-and-faith',
      uiRouterKey: 'islam-and-faith',
      order: 2,
      iconName: 'menu_book',
      relatedUid: islamDoc?.documentId ? 'api::islam-faith-page.islam-faith-page' : undefined,
      relatedDocId: islamDoc?.documentId ? String(islamDoc.documentId) : undefined,
    }),
    makeNavItem({
      title: labels.eventsPrograms,
      path: 'events-and-programs',
      uiRouterKey: 'events-and-programs',
      order: 3,
      iconName: 'calendar_month',
    }),
    makeNavItem({
      title: labels.mediaPodcasts,
      path: 'media',
      uiRouterKey: 'media',
      order: 4,
      iconName: 'podcasts',
    }),
  ];

  if (publications[0]?.documentId) {
    worshipChildren.push(
      makeNavItem({
        title: labels.publications,
        path: String(publications[0].slug || 'publications'),
        uiRouterKey: 'publications',
        order: 5,
        iconName: 'library_books',
        relatedUid: 'plugin::resources.publication',
        relatedDocId: String(publications[0].documentId),
      })
    );
  }

  const communityChildren: SeedNavItem[] = [
    makeNavItem({
      title: labels.communityServices,
      path: 'community-services',
      uiRouterKey: 'community-services',
      order: 1,
      iconName: 'volunteer_activism',
    }),
    ...services.map((svc, idx) =>
      makeNavItem({
        title: String(svc.title || `Service ${idx + 1}`),
        path: String(svc.slug || `service-${idx + 1}`),
        uiRouterKey: String(svc.slug || `service-${idx + 1}`),
        order: idx + 2,
        iconName: 'handshake',
        relatedUid: 'api::community-service.community-service',
        relatedDocId: String(svc.documentId),
      })
    ),
    makeNavItem({
      title: labels.donateZakat,
      path: 'donate',
      uiRouterKey: 'donate',
      order: services.length + 2,
      iconName: 'favorite',
      relatedUid: donationsDoc?.documentId ? 'api::donations-page.donations-page' : undefined,
      relatedDocId: donationsDoc?.documentId ? String(donationsDoc.documentId) : undefined,
    }),
  ];

  const institutionChildren: SeedNavItem[] = [
    makeNavItem({
      title: labels.aboutUs,
      path: 'about-us',
      uiRouterKey: 'about-us',
      order: 1,
      iconName: 'mosque',
      relatedUid: aboutDoc?.documentId ? 'api::about-page.about-page' : undefined,
      relatedDocId: aboutDoc?.documentId ? String(aboutDoc.documentId) : undefined,
    }),
    makeNavItem({
      title: labels.contactVisit,
      path: 'contact-and-visit',
      uiRouterKey: 'contact-and-visit',
      order: 2,
      iconName: 'location_on',
      relatedUid: contactDoc?.documentId ? 'api::contact-page.contact-page' : undefined,
      relatedDocId: contactDoc?.documentId ? String(contactDoc.documentId) : undefined,
    }),
  ];

  if (faqs[0]?.documentId) {
    institutionChildren.push(
      makeNavItem({
        title: labels.faq,
        path: 'faq',
        uiRouterKey: 'faq',
        order: 3,
        iconName: 'help',
        relatedUid: 'api::faq.faq',
        relatedDocId: String(faqs[0].documentId),
      })
    );
  }

  institutionChildren.push(
    makeNavItem({
      title: labels.search,
      path: 'search',
      uiRouterKey: 'search',
      order: institutionChildren.length + 1,
      iconName: 'search',
    })
  );

  return [
    makeNavItem({
      title: labels.footerWorshipGroup,
      path: '/',
      uiRouterKey: 'footer-worship',
      order: 1,
      iconName: 'schedule',
      items: worshipChildren,
    }),
    makeNavItem({
      title: labels.footerCommunityGroup,
      path: '/',
      uiRouterKey: 'footer-community',
      order: 2,
      iconName: 'volunteer_activism',
      items: communityChildren,
    }),
    makeNavItem({
      title: labels.footerInstitutionGroup,
      path: '/',
      uiRouterKey: 'footer-institution',
      order: 3,
      iconName: 'mosque',
      items: institutionChildren,
    }),
  ];
}

export async function seedNavigationMenus(strapi: Core.Strapi): Promise<void> {
  try {
    const navPlugin = strapi.plugin('navigation') as unknown as {
      service?: (name: string) => Record<string, any> | undefined;
    };
    const adminSvc = navPlugin?.service?.('admin');
    if (!adminSvc || typeof adminSvc.get !== 'function') return;

    const allNavs: Array<Record<string, any>> = await adminSvc.get({});
    if (!Array.isArray(allNavs)) return;

    // 1. Remove default empty 'navigation' master if it has 0 items across all locales
    const defaultNavs = allNavs.filter((n) => n.slug === 'navigation');
    if (
      defaultNavs.length > 0 &&
      defaultNavs.every((n) => !Array.isArray(n.items) || n.items.length === 0)
    ) {
      const docIds = Array.from(new Set(defaultNavs.map((n) => String(n.documentId)).filter(Boolean)));
      for (const documentId of docIds) {
        await adminSvc.delete({ auditLog: {}, documentId });
      }
    }

    // 2. If Footer Navigation had legacy '/worship' wrapper paths, recreate it cleanly
    const legacyFooterNavs = allNavs.filter(
      (n) =>
        (n.name === 'Footer Navigation' || String(n.slug || '').startsWith('footer-navigation')) &&
        Array.isArray(n.items) &&
        n.items.some((item: Record<string, any>) => item.path === 'worship' || item.path === '/worship')
    );
    if (legacyFooterNavs.length > 0) {
      const docIds = Array.from(
        new Set(legacyFooterNavs.map((n) => String(n.documentId)).filter(Boolean))
      );
      for (const documentId of docIds) {
        await adminSvc.delete({ auditLog: {}, documentId });
      }
    }

    // 3. Ensure 'Header Navigation' and 'Footer Navigation' exist across all 4 locales
    const navSpecs: Array<{
      name: string;
      slugPrefix: string;
      buildItems: (s: Core.Strapi, locale: string) => Promise<SeedNavItem[]>;
    }> = [
      {
        name: 'Header Navigation',
        slugPrefix: 'header-navigation',
        buildItems: buildHeaderNavItemsForLocale,
      },
      {
        name: 'Footer Navigation',
        slugPrefix: 'footer-navigation',
        buildItems: buildFooterNavItemsForLocale,
      },
    ];

    for (const spec of navSpecs) {
      let currentList: Array<Record<string, any>> = await adminSvc.get({});
      let matching = currentList.filter(
        (n) => n.name === spec.name || String(n.slug || '').startsWith(spec.slugPrefix)
      );

      if (matching.length === 0) {
        await adminSvc.post({
          auditLog: {},
          payload: {
            name: spec.name,
            visible: true,
          },
        });
        currentList = await adminSvc.get({});
        matching = currentList.filter(
          (n) => n.name === spec.name || String(n.slug || '').startsWith(spec.slugPrefix)
        );
      }

      for (const navRow of matching) {
        const existingItems = Array.isArray(navRow.items) ? navRow.items : [];
        if (existingItems.length === 0 && navRow.documentId && navRow.locale) {
          const items = await spec.buildItems(strapi, String(navRow.locale));
          await adminSvc.put({
            auditLog: {},
            payload: {
              id: navRow.id,
              documentId: navRow.documentId,
              name: spec.name,
              visible: true,
              locale: navRow.locale,
              items,
            },
          });
        }
      }
    }
  } catch (err) {
    strapi.log?.warn?.(`Navigation menu seeding skipped: ${(err as Error)?.message || err}`);
  }
}

export async function seedNavigationPluginConfig(strapi: Core.Strapi) {
  try {
    const storeFn = (strapi as unknown as {
      store?: (opts: { type: string; name: string }) => {
        get: (opts: { key: string }) => Promise<Record<string, any> | null>;
        set: (opts: { key: string; value: Record<string, any> }) => Promise<void>;
      };
    }).store;
    if (typeof storeFn !== 'function') return;

    const navStore = storeFn({ type: 'plugin', name: 'navigation' });
    const existing = await navStore.get({ key: 'config' });
    const currentCts = Array.isArray(existing?.contentTypes) ? existing.contentTypes : [];
    const missingAnyCt = NAVIGATION_DESIRED_CONTENT_TYPES.some(
      (uid) => !currentCts.includes(uid)
    );
    if (
      currentCts.length === 0 ||
      missingAnyCt ||
      !existing?.defaultContentType ||
      existing?.preferCustomContentTypes !== false
    ) {
      await navStore.set({
        key: 'config',
        value: {
          ...(existing || {}),
          additionalFields: [
            'audience',
            {
              name: 'icon_name',
              label: 'Navigation Icon Name',
              type: 'string',
              required: false,
              enabled: true,
            },
          ],
          contentTypes: Array.from(
            new Set([...NAVIGATION_DESIRED_CONTENT_TYPES, ...currentCts])
          ),
          defaultContentType: 'api::article.article',
          contentTypesNameFields: {
            ...(existing?.contentTypesNameFields || {}),
            ...NAVIGATION_CONTENT_TYPES_NAME_FIELDS,
          },
          pathDefaultFields: {
            ...(existing?.pathDefaultFields || {}),
            ...NAVIGATION_PATH_DEFAULT_FIELDS,
          },
          allowedLevels: 3,
          cascadeMenuAttached: true,
          preferCustomContentTypes: false,
          i18nEnabled: true,
        },
      });
    }

    await seedNavigationMenus(strapi);
  } catch {
    // Resilient fallback in test mocks
  }
}

