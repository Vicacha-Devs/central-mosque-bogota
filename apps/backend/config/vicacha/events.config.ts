export function buildMosqueEventsPluginConfig(env: any, hijriCalendar: any) {
  return {
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
          id: 'weekly-mon',
          label: 'Weekly on Mondays',
          rrule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO',
        },
        {
          id: 'weekly-tue',
          label: 'Weekly on Tuesdays',
          rrule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=TU',
        },
        {
          id: 'weekly-wed',
          label: 'Weekly on Wednesdays',
          rrule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=WE',
        },
        {
          id: 'weekly-thu',
          label: 'Weekly on Thursdays',
          rrule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=TH',
        },
        {
          id: 'weekly-fri',
          label: "Weekly on Fridays (Jumu'ah)",
          rrule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=FR',
        },
        {
          id: 'weekly-sat',
          label: 'Weekly on Saturdays (Halaqa)',
          rrule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=SA',
        },
        {
          id: 'weekly-sun',
          label: 'Weekly on Sundays',
          rrule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=SU',
        },
        { id: 'monthly', label: 'Monthly', rrule: 'FREQ=MONTHLY;INTERVAL=1' },
        { id: 'yearly', label: 'Yearly', rrule: 'FREQ=YEARLY;INTERVAL=1' },
      ],
      schemaExtensions: {
        event: {
          category: {
            type: 'enumeration',
            enum: ['general', 'education', 'community', 'youth', 'spiritual', 'ramadan'],
            default: 'general',
            pluginOptions: {
              i18n: {
                localized: false,
              },
            },
          },
          hijriDate: {
            type: 'string',
            pluginOptions: {
              i18n: {
                localized: true,
              },
            },
          },
          timeLabel: {
            type: 'string',
            pluginOptions: {
              i18n: {
                localized: true,
              },
            },
          },
          imageUrl: {
            type: 'string',
          },
          imageAlt: {
            type: 'string',
            pluginOptions: {
              i18n: {
                localized: true,
              },
            },
          },
          speakerProfile: {
            type: 'relation',
            relation: 'manyToOne',
            target: 'api::leader.leader',
          },
        },
      },
      sources: [
        {
          id: 'plugin-events',
          label: 'Eventos de la Mezquita',
          uid: 'plugin::events.event',
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
            customFields: ['hijriDate', 'featured', 'timeLabel', 'imageUrl', 'imageAlt'],
          },
          categoryColors: {
            general: '#64748B',
            education: '#2563EB',
            community: '#0D9488',
            youth: '#7C3AED',
            spiritual: '#059669',
            ramadan: '#D97706',
          },
        },
      ],
    },
  };
}
