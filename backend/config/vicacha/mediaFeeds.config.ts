export function buildMosqueMediaFeedsPluginConfig(env: any, hijriCalendar: any) {
  return {
    enabled: true,
    config: {
      defaultTimezone: env('MEDIA_FEEDS_TIMEZONE', 'America/Bogota'),
      defaultLocale: 'es',
      supportedLocales: ['es', 'en', 'ar', 'tr'],
      fallbackToDefaultLocale: true,
      secondaryCalendars: [hijriCalendar],
      podcastFeed: {
        title: 'Mezquita Central Abu Bakr As-Siddiq — Khutbahs y Podcasts',
        description:
          'Archivo oficial multilingüe (Español, Inglés, Árabe y Turco) de Khutbahs del viernes, conferencias académicas y podcasts espirituales desde Bogotá, Colombia.',
        author: 'Mezquita Central Abu Bakr As-Siddiq de Bogotá',
        ownerName: 'Centro Cultural Islámico de Colombia',
        ownerEmail: env('MOSQUE_EMAIL', 'info@mezquitabogota.org'),
        siteUrl: env('FRONTEND_URL', 'http://127.0.0.1:4321'),
        category: 'Religion & Spirituality',
        subcategory: 'Islam',
        explicit: false,
      },
      liveStream: {
        enabled: true,
        title: "Transmisión en Vivo de la Khutbah del Viernes (Jumu'ah)",
        description:
          'Sigue en directo el sermón bilingüe (árabe y español) y las conferencias especiales desde la Mezquita Central de Bogotá.',
        scheduleLabel: 'Todos los viernes • 12:15 PM (Hora de Bogotá)',
        provider: 'youtube',
        watchUrl: env(
          'MOSQUE_YOUTUBE_LIVE_URL',
          'https://www.youtube.com/watch?v=M7lc1UVf-VE'
        ),
        spokenLanguages: ['ar', 'es'],
        recurringSlots: [
          {
            dayOfWeek: 5,
            startTime: '12:15',
            endTime: '13:15',
            label: "Jumu'ah Khutbah Live",
          },
        ],
      },
      youtubeSyncSources: [
        {
          id: 'mosque-youtube-channel',
          label: 'Canal Oficial de YouTube — Mezquita Central de Bogotá',
          channelId: env('MOSQUE_YOUTUBE_CHANNEL_ID', ''),
          playlistId: env('MOSQUE_YOUTUBE_PLAYLIST_ID', ''),
          defaultType: 'khutbah',
          defaultSeriesSlug: 'jumuah-khutbahs',
          defaultSpeaker: 'Sheikh Ahmad Al-Mansoor',
          defaultSpokenLanguages: ['ar', 'es'],
          enabled: Boolean(
            env('MOSQUE_YOUTUBE_CHANNEL_ID', '') ||
              env('MOSQUE_YOUTUBE_PLAYLIST_ID', '')
          ),
        },
      ],
      defaultSeries: [
        {
          title: "Khutbahs del Viernes (Jumu'ah)",
          slug: 'jumuah-khutbahs',
          description:
            'Sermones semanales de los viernes pronunciados en árabe y español con transcripciones multilingües.',
          defaultType: 'khutbah',
          spokenLanguages: ['ar', 'es', 'en', 'tr'],
          rssEnabled: true,
          active: true,
        },
        {
          title: 'Podcast Espiritual y Vida Cotidiana',
          slug: 'spiritual-podcast',
          description:
            'Episodios breves de reflexión espiritual, oración diaria y ética comunitaria.',
          defaultType: 'podcast',
          spokenLanguages: ['es', 'en', 'ar', 'tr'],
          rssEnabled: true,
          active: true,
        },
      ],
      sources: [
        {
          id: 'mosque-media-highlights',
          label: 'Media Highlights & Khutbahs (Colección)',
          uid: 'api::media-highlight.media-highlight',
          enabled: true,
          defaultType: 'khutbah',
          defaultSpokenLanguages: ['ar', 'es'],
          typeLabels: {
            es: {
              khutbah: 'Khutbah del Viernes',
              podcast: 'Podcast Espiritual',
              video: 'Conferencia en Video',
              audio: 'Recitación de Audio',
              live: 'Transmisión en Vivo',
            },
            en: {
              khutbah: 'Friday Khutbah',
              podcast: 'Spiritual Podcast',
              video: 'Video Lecture',
              audio: 'Audio Recitation',
              live: 'Live Broadcast',
            },
            ar: {
              khutbah: 'خطبة الجمعة',
              podcast: 'بودكاست إيماني',
              video: 'محاضرة مرئية',
              audio: 'تلاوة صوتية',
              live: 'بث مباشر',
            },
            tr: {
              khutbah: 'Cuma Hutbesi',
              podcast: 'Manevi Podcast',
              video: 'Video Konferans',
              audio: 'Sesli Tilavet',
              live: 'Canlı Yayın',
            },
          },
          fields: {
            title: 'title',
            slug: 'slug',
            description: 'description',
            type: 'type',
            provider: 'provider',
            externalId: 'externalId',
            sourceUrl: 'href',
            embedUrl: 'embedUrl',
            audioFile: 'audioFile',
            transcriptFile: 'transcriptPdf',
            thumbnail: 'thumbnail',
            imageUrl: 'imageUrl',
            imageAlt: 'imageAlt',
            speaker: 'speaker',
            duration: 'duration',
            publishedAtLabel: 'publishedAtLabel',
            seriesSlug: 'seriesSlug',
            spokenLanguages: 'spokenLanguages',
            languageTracks: 'languageTracks',
            chapters: 'chapters',
            featured: 'featured',
            isLive: 'isLive',
            alternateDateFields: {
              hijri: 'hijriDate',
            },
          },
        },
      ],
    },
  };
}
