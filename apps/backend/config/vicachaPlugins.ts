import { buildMosqueBookingsPluginConfig } from './vicacha/bookings.config';
import { buildMosqueBroadcastsPluginConfig } from './vicacha/broadcasts.config';
import { buildMosqueCalendarPluginConfig } from './vicacha/calendar.config';
import { buildMosqueCertificatesPluginConfig } from './vicacha/certificates.config';
import { buildMosqueDonationsPluginConfig } from './vicacha/donations.config';
import { buildMosqueEventsPluginConfig } from './vicacha/events.config';
import { buildMosqueInboxPluginConfig } from './vicacha/inbox.config';
import { buildMosqueIslamPluginConfig } from './vicacha/islam.config';
import { buildMosqueMediaFeedsPluginConfig } from './vicacha/mediaFeeds.config';
import { buildMosqueNotesPluginConfig } from './vicacha/notes.config';
import { buildMosqueResourcesPluginConfig } from './vicacha/resources.config';

interface StrapiEnvFn {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
}

export function buildVicachaPluginsConfig(env: StrapiEnvFn) {
  const hijriCalendar = {
    id: 'hijri',
    label: 'Hijri (Umm al-Qura)',
    intlCalendar: 'islamic-umalqura',
    dayOffset: env.int('HIJRI_DAY_OFFSET', 0),
    overrideField: 'hijriDate',
    enabled: true,
  };

  return {
    // 16. Editorial Entity Notes, Audit Metadata & Global Notes Hub (@vicacha-devs/strapi-plugin-notes)
    notes: buildMosqueNotesPluginConfig(),

    // 17. Unified Multi-Collection Calendar (@vicacha-devs/strapi-plugin-calendar)
    calendar: buildMosqueCalendarPluginConfig(env, hijriCalendar),

    // 18. Events, Recurrence (RRULE), RSVP/Waitlist & iCal (@vicacha-devs/strapi-plugin-events)
    events: buildMosqueEventsPluginConfig(env, hijriCalendar),

    // 19. Bookings, Slot Availability & Guided Visits (@vicacha-devs/strapi-plugin-bookings)
    bookings: buildMosqueBookingsPluginConfig(env, hijriCalendar),

    // 20. Official Signed Certificates, Shahada & Consular Verification (@vicacha-devs/strapi-plugin-certificates)
    certificates: buildMosqueCertificatesPluginConfig(env, hijriCalendar),

    // 21. Multi-Language Media Hub, YouTube Sync, Podcast RSS 2.0 & Live Broadcast (@vicacha-devs/strapi-plugin-media-feeds)
    'media-feeds': buildMosqueMediaFeedsPluginConfig(env, hijriCalendar),

    // 22. Crowdfunding Campaigns, Mosque Utility Invoices, Zakat Calculator & Tax Certificates (@vicacha-devs/strapi-plugin-donations)
    donations: buildMosqueDonationsPluginConfig(env),

    // 23. Visual Form Builder, Service-Desk Casework Inbox, Double Opt-In Subscribers & Alert Banners (@vicacha-devs/strapi-plugin-inbox)
    inbox: buildMosqueInboxPluginConfig(env),

    // 24. Omnichannel Community Broadcasts: Email, Telegram Bot/Channel & WhatsApp (@vicacha-devs/strapi-plugin-broadcasts)
    broadcasts: buildMosqueBroadcastsPluginConfig(env),

    // 25. Native Strapi v5 Media Library Catalog: Digital Publications, Photo Galleries & Glossary (@vicacha-devs/strapi-plugin-resources)
    resources: buildMosqueResourcesPluginConfig(env),

    // 26. Comprehensive Islamic Liturgical, Scriptural & Fiqh Suite: Salah, Adhan, Iqamah, Qibla, Hilal/Eid/Ramadan, Quran/Hadith/Dua & Zakat/Nisab (@vicacha-devs/strapi-plugin-islam)
    islam: buildMosqueIslamPluginConfig(env),
  };
}
