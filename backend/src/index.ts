import type { Core } from '@strapi/strapi';
import { seedAdditionalCmsContent } from './seed/cms-seed-data';
import { seedEmailDesignerTemplates } from './seed/email-templates-seed';

const REQUIRED_LOCALES = [
  { code: 'es', name: 'Spanish (es)' },
  { code: 'en', name: 'English (en)' },
  { code: 'ar', name: 'Arabic (ar)' },
  { code: 'tr', name: 'Turkish (tr)' },
];

const PUBLIC_READ_MODELS = [
  'api::global-setting.global-setting',
  'api::prayer-setting.prayer-setting',
  'api::about-page.about-page',
  'api::donations-page.donations-page',
  'api::islam-faith-page.islam-faith-page',
  'api::contact-page.contact-page',
  'api::event.event',
  'api::community-service.community-service',
  'api::article.article',
  'api::media-highlight.media-highlight',
  'api::donation-campaign.donation-campaign',
  'api::leader.leader',
  'api::faq.faq',
];

// Principle of Least Privilege: inbound forms only allow 'create', never 'find' or 'findOne'
const PUBLIC_CREATE_ONLY_MODELS = [
  'api::contact-submission.contact-submission',
  'api::visit-booking.visit-booking',
  'api::donation-submission.donation-submission',
];

async function ensureLocales(strapi: Core.Strapi) {
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
  } catch (err) {
    strapi.log.warn('Could not auto-configure i18n locales during bootstrap');
  }
}

async function ensurePublicPermissions(strapi: Core.Strapi) {
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
      'plugin::typesense.search.search',
      'plugin::media-feeds.content-api.listEpisodes',
      'plugin::media-feeds.content-api.getEpisodeBySlug',
      'plugin::media-feeds.content-api.listSeries',
      'plugin::media-feeds.content-api.getLiveStatus',
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
  } catch (err) {
    strapi.log.warn('Could not auto-configure public role permissions');
  }
}

async function seedInitialContent(strapi: Core.Strapi) {
  try {
    const ramadanNotesByLocale: Record<string, string> = {
      es: 'Durante el mes sagrado de Ramadán ofrecemos Iftar comunitario diario al Maghrib y oración de Tarawih después de Isha.',
      en: 'During the blessed month of Ramadan, we host daily community Iftar at Maghrib and Tarawih prayers after Isha.',
      ar: 'خلال شهر رمضان المبارك نقيم إفطاراً جماعياً يومياً عند صلاة المغرب وصلاة التراويح بعد صلاة العشاء.',
      tr: 'Mübarek Ramazan ayı boyunca her gün akşam namazında toplu iftar ve yatsı namazından sonra teravih namazı düzenlenmektedir.',
    };

    for (const [locale, ramadanNotes] of Object.entries(ramadanNotesByLocale)) {
      const existingPrayerSetting = await strapi
        .documents('api::prayer-setting.prayer-setting')
        .findFirst({ locale });

      if (!existingPrayerSetting) {
        await strapi.documents('api::prayer-setting.prayer-setting').create({
          locale,
          status: 'published',
          data: {
            method: '3',
            school: '1',
            calender: 'MATHEMATICAL',
            shifting: '0',
            defaultLat: 4.6685,
            defaultLon: -74.0758,
            jumuahKhutbahTime: '12:15 PM',
            jumuahPrayerTime: '12:45 PM',
            ramadanBannerActive: false,
            ramadanNotes,
            iqamahRules: [
              { prayerName: 'fajr', mode: 'offset_minutes', offsetMinutes: 20 },
              { prayerName: 'dhuhr', mode: 'offset_minutes', offsetMinutes: 15 },
              { prayerName: 'asr', mode: 'offset_minutes', offsetMinutes: 15 },
              { prayerName: 'maghrib', mode: 'offset_minutes', offsetMinutes: 10 },
              { prayerName: 'isha', mode: 'offset_minutes', offsetMinutes: 15 },
              { prayerName: 'jumuah', mode: 'fixed_time', fixedTime: '12:45' },
            ],
          },
        });
      }
    }

    const globalSettingsByLocale: Record<
      string,
      {
        siteName: string;
        lemma: string;
        rightsText: string;
        openingHours: string;
        country: string;
      }
    > = {
      es: {
        siteName: 'Mezquita Central Abu Bakr As-Siddiq',
        lemma:
          'Dedicados a servir a la comunidad musulmana en Bogotá a través de la oración, la educación y la caridad.',
        rightsText:
          '© Mezquita Central Abu Bakr As-Siddiq Bogotá. Todos los derechos reservados.',
        openingHours: 'Abierto todos los días: 4:30 AM – 8:30 PM',
        country: 'Colombia',
      },
      en: {
        siteName: 'Abu Bakr As-Siddiq Central Mosque',
        lemma:
          'Dedicated to serving the Muslim community in Bogotá through prayer, education, and charity.',
        rightsText:
          '© Abu Bakr As-Siddiq Central Mosque Bogotá. All rights reserved.',
        openingHours: 'Open daily: 4:30 AM – 8:30 PM',
        country: 'Colombia',
      },
      ar: {
        siteName: 'مسجد أبو بكر الصديق المركزي',
        lemma:
          'مكرسون لخدمة المجتمع المسلم في بوغوتا من خلال الصلاة والتعليم والعمل الخيري.',
        rightsText:
          '© مسجد أبو بكر الصديق المركزي ببوغوتا. جميع الحقوق محفوظة.',
        openingHours: 'مفتوح يومياً: 4:30 صباحاً – 8:30 مساءً',
        country: 'كولومبيا',
      },
      tr: {
        siteName: 'Ebû Bekir Es-Sıddîk Merkez Camii',
        lemma:
          'Bogota’daki Müslüman topluma namaz, eğitim ve hayır işleri aracılığıyla hizmet etmeye adanmıştır.',
        rightsText:
          '© Ebû Bekir Es-Sıddîk Merkez Camii Bogota. Tüm hakları saklıdır.',
        openingHours: 'Her gün açık: 04:30 – 20:30',
        country: 'Kolombiya',
      },
    };

    for (const [locale, content] of Object.entries(globalSettingsByLocale)) {
      const existing = await strapi
        .documents('api::global-setting.global-setting')
        .findFirst({ locale });

      if (!existing) {
        await strapi.documents('api::global-setting.global-setting').create({
          locale,
          status: 'published',
          data: {
            siteName: content.siteName,
            lemma: content.lemma,
            rightsText: content.rightsText,
            contactInfo: {
              address: 'Calle 80 # 30-15, Barrios Unidos',
              city: 'Bogotá D.C.',
              country: content.country,
              phone: '+57 (601) 250-8000',
              whatsapp: '+57 310 555-0199',
              email: 'info@mezquitabogota.org',
              latitude: 4.6685,
              longitude: -74.0758,
              openingHours: content.openingHours,
            },
          },
        });
      }
    }

    const islamFaithByLocale: Record<
      string,
      {
        heroTitle: string;
        heroSubtitle: string;
        shahadaTransliteration: string;
        shahadaTranslation: string;
      }
    > = {
      es: {
        heroTitle: 'Descubre el Islam y los Pilares de la Fe',
        heroSubtitle:
          'Una introducción clara a las creencias, valores espirituales y prácticas esenciales del Islam.',
        shahadaTransliteration:
          'Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan Rasulu Allah',
        shahadaTranslation:
          'Atestiguo que no hay divinidad digna de adoración sino Dios (Allah), y atestiguo que Muhammad es el Mensajero de Dios.',
      },
      en: {
        heroTitle: 'Discover Islam & the Pillars of Faith',
        heroSubtitle:
          'A clear introduction to the core beliefs, spiritual values, and essential practices of Islam.',
        shahadaTransliteration:
          'Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan Rasulu Allah',
        shahadaTranslation:
          'I bear witness that there is no deity worthy of worship except God (Allah), and I bear witness that Muhammad is the Messenger of God.',
      },
      ar: {
        heroTitle: 'تعرّف على الإسلام وأركان الإيمان',
        heroSubtitle:
          'مقدمة واضحة للعقيدة الإسلامية والقيم الروحية والعبادات الأساسية في الإسلام.',
        shahadaTransliteration:
          'أشهد أن لا إله إلا الله وأشهد أن محمداً رسول الله',
        shahadaTranslation:
          'أشهد أن لا معبود بحق إلا الله وحده لا شريك له، وأشهد أن محمداً عبده ورسوله.',
      },
      tr: {
        heroTitle: 'İslam’ı ve İmanın Şartlarını Keşfedin',
        heroSubtitle:
          'İslam’ın temel inançları, manevi değerleri ve ibadet esaslarına açık bir giriş.',
        shahadaTransliteration:
          'Eşhedü en lâ ilâhe illallah ve eşhedü enne Muhammeden abduhû ve resûlüh',
        shahadaTranslation:
          'Şahitlik ederim ki Allah’tan başka ilah yoktur ve yine şahitlik ederim ki Muhammed O’nun kulu ve elçisidir.',
      },
    };

    for (const [locale, content] of Object.entries(islamFaithByLocale)) {
      const existing = await strapi
        .documents('api::islam-faith-page.islam-faith-page')
        .findFirst({ locale });

      if (!existing) {
        await strapi
          .documents('api::islam-faith-page.islam-faith-page')
          .create({
            locale,
            status: 'published',
            data: {
              heroTitle: content.heroTitle,
              heroSubtitle: content.heroSubtitle,
              shahadaArabic:
                'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ',
              shahadaTransliteration: content.shahadaTransliteration,
              shahadaTranslation: content.shahadaTranslation,
            },
          });
      }
    }

    const leadersByLocale: Record<
      string,
      Array<{
        name: string;
        roleTitle: string;
        bio: string;
        languagesSpoken: string;
        order: number;
      }>
    > = {
      es: [
        {
          name: 'Sheikh Ahmad Al-Mansoor',
          roleTitle: 'Imam Principal y Director Espiritual',
          bio: 'Licenciado en Ciencias Islámicas y Jurisprudencia (Fiqh). Guía espiritual de la Mezquita Central Abu Bakr As-Siddiq en Bogotá desde 2014.',
          languagesSpoken: 'Árabe, Español, Inglés',
          order: 1,
        },
        {
          name: 'Ustadh Tariq Ramírez',
          roleTitle: 'Coordinador de Educación y Nuevos Musulmanes',
          bio: 'Especialista en pedagogía islámica, enseñanza del idioma árabe y acompañamiento integral para nuevos musulmanes en Colombia.',
          languagesSpoken: 'Español, Árabe, Inglés',
          order: 2,
        },
        {
          name: 'Dra. Amina Gómez',
          roleTitle: 'Directora de Acción Social y Programas Familiares',
          bio: 'Lidera los programas de bienestar comunitario, distribución de Zakat y actividades educativas para mujeres y jóvenes.',
          languagesSpoken: 'Español, Inglés',
          order: 3,
        },
      ],
      en: [
        {
          name: 'Sheikh Ahmad Al-Mansoor',
          roleTitle: 'Head Imam & Spiritual Director',
          bio: 'Graduate in Islamic Sciences and Jurisprudence (Fiqh). Spiritual leader of the Abu Bakr As-Siddiq Central Mosque in Bogotá since 2014.',
          languagesSpoken: 'Arabic, Spanish, English',
          order: 1,
        },
        {
          name: 'Ustadh Tariq Ramírez',
          roleTitle: 'Education & New Muslim Coordinator',
          bio: 'Specialist in Islamic pedagogy, Arabic instruction, and comprehensive mentorship for new Muslims in Colombia.',
          languagesSpoken: 'Spanish, Arabic, English',
          order: 2,
        },
        {
          name: 'Dr. Amina Gómez',
          roleTitle: 'Director of Social Outreach & Family Programs',
          bio: 'Leads community welfare initiatives, Zakat distribution, and educational programs for women and youth.',
          languagesSpoken: 'Spanish, English',
          order: 3,
        },
      ],
      ar: [
        {
          name: 'الشيخ أحمد المنصور',
          roleTitle: 'الإمام الرئيسي والمدير الروحي',
          bio: 'حاصل على الإجازة في العلوم الإسلامية والفقه. المرشد الروحي لمسجد أبو بكر الصديق المركزي في بوغوتا منذ عام 2014.',
          languagesSpoken: 'العربية، الإسبانية، الإنجليزية',
          order: 1,
        },
        {
          name: 'الأستاذ طارق راميريز',
          roleTitle: 'منسق التعليم والمسلمين الجدد',
          bio: 'متخصص في التربية الإسلامية وتعليم اللغة العربية والإرشاد الشامل للمسلمين الجدد في كولومبيا.',
          languagesSpoken: 'الإسبانية، العربية، الإنجليزية',
          order: 2,
        },
        {
          name: 'د. أمينة غوميز',
          roleTitle: 'مديرة العمل الاجتماعي وبرامج الأسرة',
          bio: 'تشرف على برامج التكافل الاجتماعي وتوزيع الزكاة والأنشطة التعليمية للنساء والشباب.',
          languagesSpoken: 'الإسبانية، الإنجليزية',
          order: 3,
        },
      ],
      tr: [
        {
          name: 'Şeyh Ahmed El-Mansur',
          roleTitle: 'Baş İmam ve Manevi Rehber',
          bio: 'İslami İlimler ve Fıkıh mezunu. 2014 yılından bu yana Bogota Ebû Bekir Es-Sıddîk Merkez Camii’nin manevi rehberi.',
          languagesSpoken: 'Arapça, İspanyolca, İngilizce',
          order: 1,
        },
        {
          name: 'Üstad Tarık Ramírez',
          roleTitle: 'Eğitim ve Yeni Müslümanlar Koordinatörü',
          bio: 'İslami pedagoji, Arapça öğretimi ve Kolombiya’daki yeni Müslümanlar için rehberlik uzmanı.',
          languagesSpoken: 'İspanyolca, Arapça, İngilizce',
          order: 2,
        },
        {
          name: 'Dr. Amina Gómez',
          roleTitle: 'Sosyal Yardım ve Aile Programları Direktörü',
          bio: 'Toplumsal dayanışma, Zekât dağıtımı ve kadınlar ile gençlere yönelik eğitim programlarını yönetmektedir.',
          languagesSpoken: 'İspanyolca, İngilizce',
          order: 3,
        },
      ],
    };

    for (const [locale, leaders] of Object.entries(leadersByLocale)) {
      const existing = await strapi
        .documents('api::leader.leader')
        .findMany({ locale });

      if (existing.length === 0) {
        for (const leader of leaders) {
          await strapi.documents('api::leader.leader').create({
            locale,
            status: 'published',
            data: leader,
          });
        }
      }
    }

    await seedAdditionalCmsContent(strapi);
  } catch (err) {
    strapi.log.warn('Initial content seed skipped or partially applied');
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureLocales(strapi);
    await ensurePublicPermissions(strapi);
    await seedInitialContent(strapi);
    await seedEmailDesignerTemplates(strapi);
  },
};
