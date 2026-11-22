export function buildMosqueBookingsPluginConfig(env: any, hijriCalendar: any) {
  return {
    enabled: true,
    config: {
      defaultTimezone: env('BOOKINGS_TIMEZONE', 'America/Bogota'),
      defaultLocale: 'es',
      theme: 'breeze',
      secondaryCalendarLanguage: 'local',
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
          uid: 'plugin::bookings.booking',
          label: 'Visitas Guiadas (Bookings)',
          color: '#D97706',
          enabled: true,
          customerNameField: 'customerName',
          customerEmailField: 'customerEmail',
          customerPhoneField: 'customerPhone',
          organizationField: 'organization',
          dateField: 'startDate',
          slotLabelField: 'slotLabel',
          partySizeField: 'partySize',
          statusField: 'status',
          languageField: 'preferredLanguage',
          notesField: 'notes',
          slotWindows: {
            morning: { start: '09:00', end: '12:00' },
            afternoon: { start: '14:00', end: '17:00' },
          },
        },
      ],
    },
  };
}
