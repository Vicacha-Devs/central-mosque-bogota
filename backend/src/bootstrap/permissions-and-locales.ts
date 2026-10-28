import type { Core } from '@strapi/strapi';

export const REQUIRED_LOCALES = [
  { code: 'es', name: 'Spanish (es)' },
  { code: 'en', name: 'English (en)' },
  { code: 'ar', name: 'Arabic (ar)' },
  { code: 'tr', name: 'Turkish (tr)' },
];

export const PUBLIC_READ_MODELS = [
  'api::global-setting.global-setting',
  'api::about-page.about-page',
  'api::donations-page.donations-page',
  'api::islam-faith-page.islam-faith-page',
  'api::contact-page.contact-page',
  'api::community-service.community-service',
  'api::article.article',
  'api::leader.leader',
  'api::faq.faq',
  'plugin::events.event',
  'plugin::donations.campaign',
  'plugin::media-feeds.media-item',
];

// Principle of Least Privilege: inbound plugin submission entities only allow 'create', never 'find' or 'findOne'
export const PUBLIC_CREATE_ONLY_MODELS = [
  'plugin::inbox.submission',
  'plugin::bookings.booking',
  'plugin::donations.pledge',
];

export async function ensureLocales(strapi: Core.Strapi) {
  try {
    const localeService = strapi.plugin('i18n')?.service('locales');
    if (!localeService) return;

    const existing = await localeService.find();
    const existingCodes = new Set(existing.map((l: { code: string }) => l.code));

    for (const loc of REQUIRED_LOCALES) {
      if (!existingCodes.has(loc.code)) {
        await localeService.create(loc);
      }
    }
  } catch {
    strapi.log.warn('Could not auto-configure i18n locales during bootstrap');
  }
}

export async function ensurePublicPermissions(strapi: Core.Strapi) {
  try {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const actionsToEnable: string[] = [
      'plugin::strapi-5-sitemap-plugin.controller.getSitemap',
      'plugin::strapi-5-sitemap-plugin.controller.getSitemapBySlug',
      'plugin::navigation.navigation.render',
      'plugin::navigation.navigation.renderChild',
      'plugin::navigation.client.render',
      'plugin::navigation.client.renderChild',
      'plugin::navigation.client.readAll',
      'plugin::typesense.search.search',
      'plugin::media-feeds.content-api.listEpisodes',
      'plugin::media-feeds.content-api.getEpisodeBySlug',
      'plugin::media-feeds.content-api.listSeries',
      'plugin::media-feeds.content-api.getLiveStatus',
      'plugin::media-feeds.content-api.getRssXml',
      'plugin::media-feeds.content-api.getPodcastRssXml',
      'plugin::donations.content-api.listCampaigns',
      'plugin::donations.content-api.listUtilityInvoices',
      'plugin::donations.content-api.getCampaignBySlug',
      'plugin::donations.content-api.getCalculatorAndDirectory',
      'plugin::donations.content-api.calculateAssessment',
      'plugin::donations.content-api.submitPledge',
      'plugin::donations.content-api.handleWebhook',
      'plugin::inbox.inboxController.listForms',
      'plugin::inbox.inboxController.getFormBySlug',
      'plugin::inbox.inboxController.submitForm',
      'plugin::inbox.inboxController.subscribe',
      'plugin::inbox.inboxController.confirmSubscription',
      'plugin::inbox.inboxController.unsubscribe',
      'plugin::inbox.inboxController.getActiveAlerts',
      'plugin::broadcasts.broadcastController.listPublicChannels',
      'plugin::broadcasts.broadcastController.listPublicArchive',
      'plugin::resources.resourcesController.getHubOverview',
      'plugin::resources.resourcesController.listPublications',
      'plugin::resources.resourcesController.getPublicationBySlug',
      'plugin::resources.resourcesController.downloadPublication',
      'plugin::resources.resourcesController.listGalleries',
      'plugin::resources.resourcesController.getGalleryBySlug',
      'plugin::resources.resourcesController.listGlossary',
      'plugin::resources.publication.find',
      'plugin::resources.publication.findOne',
      'plugin::resources.gallery-album.find',
      'plugin::resources.gallery-album.findOne',
      'plugin::resources.glossary-term.find',
      'plugin::resources.glossary-term.findOne',
      'plugin::islam.content-api.getPrayerTimes',
      'plugin::islam.content-api.getMonthlyPrayerTimes',
      'plugin::islam.content-api.getPrayerCalendarIcs',
      'plugin::islam.content-api.getQibla',
      'plugin::islam.content-api.getHijriAndObservances',
      'plugin::islam.content-api.convertDate',
      'plugin::islam.content-api.getScriptureHub',
      'plugin::islam.content-api.getDailyInspiration',
      'plugin::islam.content-api.getQuranChapters',
      'plugin::islam.content-api.getQuranChapterInfo',
      'plugin::islam.content-api.getQuranChapterVerses',
      'plugin::islam.content-api.getQuranVerseByKey',
      'plugin::islam.content-api.getQuranAyahHadiths',
      'plugin::islam.content-api.getQuranChapterAudio',
      'plugin::islam.content-api.getQuranResources',
      'plugin::islam.content-api.getNisab',
      'plugin::islam.content-api.calculateZakat',
      'plugin::islam.content-api.calculateFitranaFidyah',
      'plugin::events.content-api.listOccurrences',
      'plugin::events.content-api.listSpotlights',
      'plugin::events.content-api.downloadFeedIcs',
      'plugin::events.content-api.downloadEventInviteIcs',
      'plugin::events.content-api.getEventStats',
      'plugin::events.content-api.registerAttendee',
      'plugin::events.content-api.cancelRegistration',
      'plugin::bookings.content-api.listPublicResources',
      'plugin::bookings.content-api.getAvailableSlots',
      'plugin::bookings.content-api.createReservation',
      'plugin::bookings.content-api.rescheduleReservation',
      'plugin::bookings.content-api.cancelReservation',
      'plugin::bookings.content-api.getICalFeed',
      'plugin::calendar.content-api.getOccurrences',
      'plugin::calendar.content-api.downloadFeedIcs',
      'plugin::calendar.content-api.downloadEventIcs',
      'plugin::certificates.content-api.listPublicTemplates',
      'plugin::certificates.content-api.getPublicKey',
      'plugin::certificates.content-api.applyCertificate',
      'plugin::certificates.content-api.verifyBySerial',
      'plugin::certificates.content-api.downloadPrintableHtml',
      'plugin::certificates.content-api.docusignWebhook',
    ];
    for (const uid of PUBLIC_READ_MODELS) {
      actionsToEnable.push(`${uid}.find`, `${uid}.findOne`);
    }
    for (const uid of PUBLIC_CREATE_ONLY_MODELS) {
      actionsToEnable.push(`${uid}.create`);
    }

    for (const action of actionsToEnable) {
      const exists = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({
          where: {
            role: publicRole.id,
            action,
          },
        });

      if (!exists) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action,
            role: publicRole.id,
          },
        });
      }
    }
  } catch {
    strapi.log.warn('Could not auto-configure public role permissions');
  }
}
