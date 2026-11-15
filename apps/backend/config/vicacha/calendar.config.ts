export function buildMosqueCalendarPluginConfig(env: any, hijriCalendar: any) {
  return {
    enabled: true,
    config: {
      defaultTimezone: env('CALENDAR_TIMEZONE', 'America/Bogota'),
      defaultLocale: 'es',
      defaultView: 'dayGridMonth',
      theme: 'breeze',
      secondaryCalendarLanguage: 'local',
      firstDayOfWeek: 1,
      weekNumbers: true,
      weekNumberCalculation: 'ISO',
      timeFormat24h: false,
      feedTitle: 'Mezquita Central Abu Bakr As-Siddiq — Calendario General',
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
    },
  };
}
