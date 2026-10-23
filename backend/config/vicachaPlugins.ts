import { buildMosqueBroadcastsPluginConfig } from './vicacha/broadcasts.config';
import { buildMosqueDonationsPluginConfig } from './vicacha/donations.config';
import { buildMosqueInboxPluginConfig } from './vicacha/inbox.config';
import { buildMosqueIslamPluginConfig } from './vicacha/islam.config';
import { buildMosqueMediaFeedsPluginConfig } from './vicacha/mediaFeeds.config';
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
    // 17. Unified Multi-Collection Calendar (@vicacha-devs/strapi-plugin-calendar)
    calendar: {
      enabled: true,
      config: {
        defaultTimezone: env('CALENDAR_TIMEZONE', 'America/Bogota'),
        defaultLocale: 'auto',
        defaultView: 'dayGridMonth',
        firstDayOfWeek: 1,
        weekNumbers: true,
        weekNumberCalculation: 'ISO',
        timeFormat24h: false,
        feedTitle: 'Mezquita Central Abu Bakr As-Siddiq — Calendario General',
        secondaryCalendars: [hijriCalendar],
      },
    },

    // 18. Events, Recurrence (RRULE), RSVP/Waitlist & iCal (@vicacha-devs/strapi-plugin-events)
    events: {
      enabled: true,
      config: {
        defaultTimezone: env('EVENTS_TIMEZONE', 'America/Bogota'),
        defaultCapacity: 120,
        waitlistEnabledByDefault: true,
        defaultMaxGuestsPerRegistration: 6,
        sendRsvpEmails: true,
        feedTitle: 'Mezquita Central Abu Bakr As-Siddiq — Calendario de Eventos',
        secondaryCalendars: [hijriCalendar],
        recurrencePresets: [
          { id: 'daily', label: 'Daily', rrule: 'FREQ=DAILY;INTERVAL=1' },
          {
            id: 'jumuah',
            label: "Weekly on Fridays (Jumu'ah)",
            rrule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=FR',
          },
          {
            id: 'weekend-halaqa',
            label: 'Weekly on Saturdays (Halaqa)',
            rrule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=SA',
          },
          { id: 'monthly', label: 'Monthly', rrule: 'FREQ=MONTHLY;INTERVAL=1' },
          { id: 'yearly', label: 'Yearly', rrule: 'FREQ=YEARLY;INTERVAL=1' },
        ],
        schemaExtensions: {
          event: {
            hijriDate: {
              type: 'string',
              pluginOptions: {
                i18n: {
                  localized: true,
                },
              },
            },
          },
        },
        sources: [
          {
            id: 'mosque-events',
            label: 'Eventos de la Mezquita',
            uid: 'api::event.event',
            color: '#0D9488',
            enabled: true,
            fields: {
              title: 'title',
              startDate: 'startDate',
              endDate: 'endDate',
              rrule: 'recurrence',
              location: 'location',
              category: 'category',
              summary: 'summary',
              slug: 'slug',
              capacity: 'capacity',
              rsvpEnabled: 'rsvpEnabled',
              poster: 'poster',
              actionLinks: 'actionLinks',
              spotlightConfig: 'spotlightConfig',
              alternateDateFields: {
                hijri: 'hijriDate',
              },
              customFields: ['hijriDate', 'featured', 'timeLabel'],
            },
            categoryColors: {
              education: '#2563EB',
              community: '#0D9488',
              youth: '#7C3AED',
              spiritual: '#059669',
              ramadan: '#D97706',
            },
          },
        ],
      },
    },

    // 19. Bookings, Slot Availability & Guided Visits (@vicacha-devs/strapi-plugin-bookings)
    bookings: {
      enabled: true,
      config: {
        defaultTimezone: env('BOOKINGS_TIMEZONE', 'America/Bogota'),
        defaultSlotDurationMinutes: 180,
        defaultBufferBeforeMinutes: 0,
        defaultBufferAfterMinutes: 30,
        defaultCapacityPerSlot: 150,
        defaultMinLeadTimeHours: 24,
        defaultMaxAdvanceDays: 90,
        defaultRequiresApproval: true,
        sendEmailNotifications: true,
        secondaryCalendars: [hijriCalendar],
        defaultSeasonalSchedules: [
          {
            id: 'year-end-visits',
            label: 'Horario de Fin de Año (Year-End Schedule)',
            startDate: '12-20',
            endDate: '01-06',
            yearless: true,
            priority: 10,
            schedule: {
              mode: 'window',
              days: {
                '1': [{ start: '09:00', end: '12:00', label: 'morning', capacity: 100 }],
                '2': [{ start: '09:00', end: '12:00', label: 'morning', capacity: 100 }],
                '3': [{ start: '09:00', end: '12:00', label: 'morning', capacity: 100 }],
                '4': [{ start: '09:00', end: '12:00', label: 'morning', capacity: 100 }],
                '6': [{ start: '09:00', end: '12:00', label: 'morning', capacity: 120 }],
              },
            },
          },
        ],
        holidays: [
          {
            id: 'new-year',
            name: 'Año Nuevo (Cerrado para visitas guiadas)',
            date: '01-01',
            yearless: true,
            isClosed: true,
          },
        ],
        schemaExtensions: {
          booking: {
            preferredGuideLanguage: {
              type: 'enumeration',
              enum: ['es', 'en', 'ar', 'tr'],
              default: 'es',
            },
            hijriDate: {
              type: 'string',
            },
          },
        },
        sources: [
          {
            id: 'visit-bookings',
            uid: 'api::visit-booking.visit-booking',
            label: 'Visitas Guiadas (Colección)',
            color: '#D97706',
            enabled: true,
            customerNameField: 'visitorName',
            customerEmailField: 'email',
            customerPhoneField: 'phone',
            organizationField: 'organizationOrSchool',
            dateField: 'preferredDate',
            slotLabelField: 'preferredTimeSlot',
            partySizeField: 'groupSize',
            statusField: 'status',
            languageField: 'preferredGuideLanguage',
            notesField: 'notes',
            slotWindows: {
              morning: { start: '09:00', end: '12:00' },
              afternoon: { start: '14:00', end: '17:00' },
            },
          },
        ],
      },
    },

    // 20. Official Signed Certificates, Shahada & Consular Verification (@vicacha-devs/strapi-plugin-certificates)
    certificates: {
      enabled: true,
      config: {
        organizationName: 'Mezquita Central Abu Bakr As-Siddiq de Bogotá',
        organizationSubheader:
          'Centro Cultural Islámico de Colombia — Bogotá D.C., Colombia',
        verificationBaseUrl: env(
          'CERTIFICATES_VERIFY_URL',
          `${env('FRONTEND_URL', 'http://127.0.0.1:4321')}/verify-certificate`
        ),
        defaultTimezone: env('CERTIFICATES_TIMEZONE', 'America/Bogota'),
        defaultLocale: 'es',
        maskPublicRecipientName: true,
        allowPublicApplications: true,
        secondaryCalendars: [hijriCalendar],
        esign: {
          enabled: Boolean(env('DOCUSIGN_ACCOUNT_ID', '')),
          provider: env('DOCUSIGN_ACCOUNT_ID', '') ? 'docusign' : 'none',
          baseUrl: env(
            'DOCUSIGN_BASE_URL',
            'https://demo.docusign.net/restapi'
          ),
          accountId: env('DOCUSIGN_ACCOUNT_ID', ''),
          integrationKey: env('DOCUSIGN_INTEGRATION_KEY', ''),
          emailSubjectPrefix:
            'Mezquita Central de Bogotá — Firma de Certificado Oficial',
        },
        defaultTemplates: [
          {
            name: 'Certificado Oficial de Shahada (Profesión de Fe Islámica)',
            slug: 'shahada-certificate',
            description:
              'Certificado oficial firmado criptográficamente (Ed25519) para nuevos musulmanes que pronuncian la Shahada ante el Imam y dos testigos oficiales.',
            serialPrefix: 'SHD',
            defaultValidityDays: null,
            requiresWitnesses: true,
            minWitnesses: 2,
            requiresApproval: true,
            esignEnabled: true,
            esignProvider: 'docusign',
            organizationName: 'Mezquita Central Abu Bakr As-Siddiq de Bogotá',
            organizationSubheader:
              'Centro Cultural Islámico de Colombia — Bogotá D.C., Colombia',
            headerText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            titleText:
              'Certificado Oficial de Profesión de Fe Islámica (Shahada)',
            bodyTemplate:
              'La Mezquita Central Abu Bakr As-Siddiq de Bogotá certifica oficialmente que {{recipientFullName}} (Nombre Islámico adoptado: {{chosenName}}), identificado(a) con documento {{nationalIdMasked}}, pronunció libre y sinceramente el Testimonio de Fe Islámica (Ash-hadu an la ilaha illa Allah wa ash-hadu anna Muhammadan Rasulu Allah) el día {{issuedDateFormatted}} ({{secondaryDateFormatted}}), ingresando a la comunidad musulmana ante el Imam y los testigos oficiales abajo firmantes.',
            footerText:
              'Válido para trámites comunitarios, matrimonio islámico (Nikah) y solicitud de visado de Hajj / Umrah ante representaciones consulares.',
            defaultSignatories: [
              {
                name: 'Sheikh Principal de la Mezquita',
                title: 'Imam y Director Espiritual',
                role: 'Autoridad Religiosa',
                email: env('MOSQUE_IMAM_EMAIL', 'imam@mezquitabogota.org'),
                routingOrder: 2,
              },
              {
                name: 'Presidente de la Junta Directiva',
                title: 'Representante Legal',
                role: 'Dirección Institucional',
                email: env(
                  'MOSQUE_PRESIDENT_EMAIL',
                  'presidencia@mezquitabogota.org'
                ),
                routingOrder: 2,
              },
            ],
            secondaryCalendars: [hijriCalendar],
            accentColor: '#14532d',
            active: true,
          },
          {
            name: 'Certificado Consular de Pertenencia a la Comunidad Musulmana (Hajj / Umrah)',
            slug: 'muslim-membership-certificate',
            description:
              'Certificación oficial de pertenencia activa a la comunidad musulmana para trámites consulares de Hajj, Umrah y Nikah.',
            serialPrefix: 'MSC',
            defaultValidityDays: 365,
            requiresWitnesses: false,
            minWitnesses: 0,
            requiresApproval: true,
            organizationName: 'Mezquita Central Abu Bakr As-Siddiq de Bogotá',
            organizationSubheader:
              'Centro Cultural Islámico de Colombia — Bogotá D.C., Colombia',
            headerText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            titleText: 'Certificado Oficial de Pertenencia Islámica',
            bodyTemplate:
              'Por medio de la presente, la {{organizationName}} certifica que {{recipientFullName}}, con documento {{nationalIdMasked}}, es miembro reconocido(a) de la comunidad musulmana de Bogotá D.C. Este certificado se expide el {{issuedDateFormatted}} ({{secondaryDateFormatted}}) para fines consulares, visado de peregrinación (Hajj / Umrah) y trámites religiosos oficiales.',
            defaultSignatories: [
              {
                name: 'Sheikh Principal de la Mezquita',
                title: 'Imam y Director Espiritual',
                role: 'Autoridad Religiosa',
              },
            ],
            secondaryCalendars: [hijriCalendar],
            accentColor: '#0f766e',
            active: true,
          },
          {
            name: 'Certificado Tributario de Donación (DIAN Estatuto Tributario Art. 125-2 / Art. 257)',
            slug: 'dian-donation-certificate',
            description:
              'Certificado oficial de donación expedido por el Centro Cultural Islámico de Colombia (ESAL) para descuento tributario ante la DIAN.',
            serialPrefix: 'DON-DIAN',
            defaultValidityDays: 0,
            requiresWitnesses: false,
            minWitnesses: 0,
            requiresApproval: true,
            organizationName: 'Centro Cultural Islámico de Colombia — Mezquita Central Abu Bakr As-Siddiq',
            organizationSubheader: 'NIT 800.194.281-5 • Entidad Sin Ánimo de Lucro (Régimen Tributario Especial DIAN)',
            headerText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            titleText: 'Certificado Oficial de Donación — Efectos Tributarios DIAN',
            bodyTemplate:
              'El suscrito Representante Legal y Revisor Fiscal del {{organizationName}} certifican que {{recipientFullName}}, identificado(a) con documento {{nationalIdMasked}}, realizó una donación verificada e irrevocable el {{issuedDateFormatted}} ({{secondaryDateFormatted}}), destinada exclusivamente al desarrollo del objeto social, sostenimiento de servicios públicos de la mezquita y programas comunitarios de la entidad, conforme a los artículos 125-2 y 257 del Estatuto Tributario de Colombia.',
            defaultSignatories: [
              {
                name: 'Presidente y Representante Legal',
                title: 'Representante Legal',
                role: 'Dirección Institucional',
                email: env('MOSQUE_PRESIDENT_EMAIL', 'presidencia@mezquitabogota.org'),
                routingOrder: 1,
              },
              {
                name: 'Contador Público / Revisor Fiscal',
                title: 'Revisoría Fiscal',
                role: 'Certificación Contable DIAN',
                email: env('MOSQUE_TREASURER_EMAIL', 'contabilidad@mezquitabogota.org'),
                routingOrder: 2,
              },
            ],
            secondaryCalendars: [hijriCalendar],
            accentColor: '#14532d',
            active: true,
          },
        ],
      },
    },

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

