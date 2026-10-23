type EnvFn = {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
};

export function buildMosqueIslamPluginConfig(env: EnvFn) {
  return {
    enabled: true,
    config: {
      mosqueName: 'Mezquita Central Abu Bakr As-Siddiq de Bogotá',
      city: 'Bogotá',
      country: 'Colombia',
      timezone: env('PRAYER_TIMEZONE', 'America/Bogota'),
      defaultLocale: 'es',
      supportedLocales: ['es', 'en', 'ar', 'tr'],
      defaultLat: 4.6685,
      defaultLon: -74.0758,
      elevationMeters: 2640,
      method: env('ISLAM_CALCULATION_METHOD', '3'),
      school: env('ISLAM_ASR_SCHOOL', '1'),
      calender: env('ISLAM_CALENDAR_METHOD', 'MATHEMATICAL'),
      shifting: String(env.int('HIJRI_DAY_OFFSET', 0)),
      highLatitudeRule: 'AngleBased',
      minuteAdjustments: {
        fajr: 0,
        sunrise: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
      },
      iqamahRules: [
        {
          prayerName: 'fajr',
          mode: 'offset_minutes',
          offsetMinutes: 20,
          notes: '20 minutos después del Adhan',
        },
        {
          prayerName: 'dhuhr',
          mode: 'offset_minutes',
          offsetMinutes: 15,
          notes: '15 minutos después del Adhan',
        },
        {
          prayerName: 'asr',
          mode: 'offset_minutes',
          offsetMinutes: 15,
          notes: '15 minutos después del Adhan',
        },
        {
          prayerName: 'maghrib',
          mode: 'offset_minutes',
          offsetMinutes: 10,
          notes: '10 minutos después del Adhan',
        },
        {
          prayerName: 'isha',
          mode: 'offset_minutes',
          offsetMinutes: 15,
          notes: '15 minutos después del Adhan',
        },
        {
          prayerName: 'jumuah',
          mode: 'fixed_time',
          offsetMinutes: 30,
          fixedTime: '12:45',
          notes: 'Khutbah 12:15 PM • Oración Congregacional 12:45 PM',
        },
      ],
      jumuahShifts: [
        {
          id: 'jumuah-main',
          label: {
            es: "Jumu'ah Principal (Árabe y Español)",
            en: "Main Jumu'ah (Arabic & Spanish)",
            ar: 'صلاة الجمعة الرئيسية (العربية والإسبانية)',
            tr: 'Ana Cuma Namazı (Arapça ve İspanyolca)',
          },
          khutbahTime: '12:15',
          prayerTime: '12:45',
          khatibName: 'Sheikh Principal de la Mezquita',
          languages: ['ar', 'es'],
          isPrimary: true,
        },
      ],
      externalApiEnabled: env.bool('ISLAM_EXTERNAL_API_ENABLED', true),
      externalApiBaseUrl: env(
        'ISLAMIC_API_URL',
        'https://islamicapi.com/api/v1/'
      ),
      cacheTtlSeconds: env.int('ISLAM_CACHE_TTL_SECONDS', 3600),
      quranFoundation: {
        enabled: env.bool('QF_ENABLED', true),
        environment:
          env('QF_ENV', 'production') === 'prelive' ? 'prelive' : 'production',
        oauth2BaseUrlPrelive: 'https://prelive-oauth2.quran.foundation',
        apiBaseUrlPrelive: 'https://apis-prelive.quran.foundation/content/api/v4',
        oauth2BaseUrlProduction: 'https://oauth2.quran.foundation',
        apiBaseUrlProduction: 'https://apis.quran.foundation/content/api/v4',
        publicFallbackBaseUrl: 'https://api.quran.com/api/v4',
        defaultScript: env('QF_DEFAULT_SCRIPT', 'uthmani'),
        defaultReciterId: env.int('QF_DEFAULT_RECITER_ID', 7),
        defaultChapterReciterId: env.int('QF_DEFAULT_CHAPTER_RECITER_ID', 7),
        defaultTranslationIdsByLocale: {
          es: [83, 140], // Sheikh Isa Garcia (83), Montada Islamic Foundation (140)
          en: [20, 85], // Saheeh International (20), Abdul Haleem (85)
          ar: [16],
          tr: [77],
        },
        defaultTafsirIdsByLocale: {
          es: [169],
          en: [169],
          ar: [16, 14],
          tr: [169],
        },
        includeTransliterationByDefault: true,
        includeWordByWordByDefault: false,
        disableBrowserAutoTranslate: true,
      },
      ramadan: {
        bannerActive: env.bool('RAMADAN_BANNER_ACTIVE', false),
        hijriYear: 1448,
        imsakOffsetMinutes: 10,
        taraweehTime: '20:00',
        taraweehRakaat: 20,
        qiyamLastTenTime: '02:30',
        communityIftarEnabled: true,
        notes: {
          es: 'Iftar comunitario diario al Maghrib y oración de Taraweeh inmediatamente después de Isha.',
          en: 'Daily community Iftar at Maghrib and Taraweeh prayers immediately following Isha.',
          ar: 'إفطار جماعي يومي عند المغرب وصلاة التراويح بعد العشاء مباشرة.',
          tr: 'Her gün akşam ezanında topluluk iftarı ve yatsı namazının ardından teravih namazı.',
        },
      },
      fiqhRates: {
        defaultCurrency: 'COP',
        defaultStandard: 'common',
        goldPricePerGramByCurrency: {
          COP: env.int('ZAKAT_GOLD_GRAM_COP', 385000),
          USD: env.int('ZAKAT_GOLD_GRAM_USD', 92),
          EUR: env.int('ZAKAT_GOLD_GRAM_EUR', 85),
          TRY: env.int('ZAKAT_GOLD_GRAM_TRY', 3150),
        },
        silverPricePerGramByCurrency: {
          COP: env.int('ZAKAT_SILVER_GRAM_COP', 4400),
          USD: 1.05,
          EUR: 0.96,
          TRY: 36,
        },
        zakatAlFitrPerPersonByCurrency: {
          COP: env.int('ZAKAT_FITR_PERSON_COP', 35000),
          USD: 12,
          EUR: 11,
          TRY: 250,
        },
        fidyahPerDayByCurrency: {
          COP: env.int('FIDYAH_DAY_COP', 25000),
          USD: 10,
          EUR: 9,
          TRY: 180,
        },
        kaffarahFastByCurrency: {
          COP: 1500000,
          USD: 600,
          EUR: 540,
          TRY: 10800,
        },
        kaffarahOathByCurrency: {
          COP: 250000,
          USD: 100,
          EUR: 90,
          TRY: 1800,
        },
        stapleFoodWeightKg: 2.5,
      },
      enableDonationsBridge: true,
      enableCalendarBridge: true,
      enableBroadcastsBridge: true,
      enableInboxAlertBridge: true,
      prayerSettingMapping: {
        enabled: true,
        uid: 'api::prayer-setting.prayer-setting',
        fields: {
          method: 'method',
          school: 'school',
          calender: 'calender',
          shifting: 'shifting',
          defaultLat: 'defaultLat',
          defaultLon: 'defaultLon',
          iqamahRules: 'iqamahRules',
          jumuahKhutbahTime: 'jumuahKhutbahTime',
          jumuahPrayerTime: 'jumuahPrayerTime',
          ramadanBannerActive: 'ramadanBannerActive',
          ramadanNotes: 'ramadanNotes',
        },
      },
      faithPageMapping: {
        enabled: true,
        uid: 'api::islam-faith-page.islam-faith-page',
        fields: {
          heroTitle: 'heroTitle',
          heroSubtitle: 'heroSubtitle',
          introText: 'introText',
          shahadaArabic: 'shahadaArabic',
          shahadaTransliteration: 'shahadaTransliteration',
          shahadaTranslation: 'shahadaTranslation',
          fivePillars: 'fivePillars',
          newMuslimGuidePdf: 'newMuslimGuidePdf',
        },
      },
    },
  };
}
