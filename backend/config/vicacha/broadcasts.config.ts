type EnvFn = {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
};

export function buildMosqueBroadcastsPluginConfig(env: EnvFn) {
  const siteBaseUrl = env('FRONTEND_URL', 'https://mezquitabogota.org');

  return {
    enabled: true,
    config: {
      primaryCalendar: 'gregory',
      secondaryCalendars: ['islamic-umalqura'],
      defaultLocale: 'es',
      supportedLocales: ['es', 'en', 'ar', 'tr'],
      availableTopics: [
        'announcements',
        'events',
        'courses',
        'ramadan_eid',
        'urgent_janazah',
        'newsletter',
      ],
      dryRun: env.bool('BROADCASTS_DRY_RUN', true),
      enableInboxSubscriberBridge: true,
      enableEventHubAutomations: true,
      siteBaseUrl,
      organizationName: 'Mezquita Central Abu Bakr As-Siddiq — Bogotá',
      emailFromAddress: env('EMAIL_DEFAULT_FROM', 'no-reply@mezquitabogota.org'),
      emailReplyToAddress: env('MOSQUE_INBOX_EMAIL', 'info@mezquitabogota.org'),
      telegramEnabled: env.bool('TELEGRAM_BROADCASTS_ENABLED', true),
      telegramBotToken: env('TELEGRAM_BOT_TOKEN', ''),
      telegramDefaultChatId: env(
        'TELEGRAM_DEFAULT_CHAT_ID',
        '@MezquitaCentralBogota'
      ),
      telegramTopicThreadMap: {
        announcements: env.int('TELEGRAM_THREAD_ANNOUNCEMENTS', 0),
        events: env.int('TELEGRAM_THREAD_EVENTS', 0),
        courses: env.int('TELEGRAM_THREAD_COURSES', 0),
        ramadan_eid: env.int('TELEGRAM_THREAD_RAMADAN', 0),
        urgent_janazah: env.int('TELEGRAM_THREAD_JANAZAH', 0),
      },
      whatsappEnabled: env.bool('WHATSAPP_BROADCASTS_ENABLED', true),
      whatsappDriver: env('WHATSAPP_DRIVER', 'meta-cloud'),
      whatsappPhoneNumberId: env('WHATSAPP_PHONE_NUMBER_ID', ''),
      whatsappAccessToken: env('WHATSAPP_ACCESS_TOKEN', ''),
      whatsappGatewayUrl: env('WHATSAPP_GATEWAY_URL', ''),
      whatsappGatewaySession: env('WHATSAPP_GATEWAY_SESSION', 'default'),
      whatsappGatewayApiKey: env('WHATSAPP_GATEWAY_API_KEY', ''),
      publicChannelLinks: [
        {
          id: 'telegram-main',
          channel: 'telegram',
          label: 'Canal Oficial de Telegram',
          handle: '@MezquitaCentralBogota',
          inviteUrl: env(
            'PUBLIC_TELEGRAM_CHANNEL_URL',
            'https://t.me/MezquitaCentralBogota'
          ),
          topic: 'announcements',
          localizedLabels: {
            es: 'Canal Oficial de Telegram',
            en: 'Official Telegram Channel',
            ar: 'القناة الرسمية على تيليجرام',
            tr: 'Resmi Telegram Kanalı',
          },
          localizedDescriptions: {
            es: 'Horarios de Jumu’ah, avistamiento lunar de Ramadán y Eid, cursos y avisos urgentes.',
            en: 'Jumu’ah schedules, Ramadan & Eid moon sighting, courses, and urgent community notices.',
            ar: 'مواعيد صلاة الجمعة، تحري هلال رمضان والعيد، الدورات والإعلانات العاجلة.',
            tr: 'Cuma vakitleri, Ramazan ve Bayram hilal gözlemi, kurslar ve acil duyurular.',
          },
        },
        {
          id: 'whatsapp-community',
          channel: 'whatsapp',
          label: 'Comunidad Oficial de WhatsApp',
          handle: env('PUBLIC_WHATSAPP_HANDLE', '+57 310 555-0199'),
          inviteUrl: env(
            'PUBLIC_WHATSAPP_CHANNEL_URL',
            'https://whatsapp.com/channel/0029VaMezquitaBogota'
          ),
          topic: 'announcements',
          localizedLabels: {
            es: 'Comunidad Oficial de WhatsApp',
            en: 'Official WhatsApp Community',
            ar: 'مجتمع واتساب الرسمي',
            tr: 'Resmi WhatsApp Topluluğu',
          },
          localizedDescriptions: {
            es: 'Alertas directas de oración funeraria (Janazah), eventos comunitarios y boletín semanal.',
            en: 'Direct Janazah funeral prayer alerts, community events, and weekly newsletter.',
            ar: 'تنبيهات صلاة الجنازة العاجلة، الفعاليات المجتمعية والنشرة الأسبوعية.',
            tr: 'Acil cenaze namazı duyuruları, topluluk etkinlikleri ve haftalık bülten.',
          },
        },
      ],
      presetCampaigns: [
        {
          slug: 'jumuah-weekly-reminder',
          title: 'Recordatorio Semanal de Khutbah y Oración del Viernes (Jumu’ah)',
          topic: 'announcements',
          channels: ['email', 'telegram', 'whatsapp'],
          priority: 'normal',
          subject: '🕌 Jumu’ah en {{organizationName}} ({{secondaryDate}})',
          bodyText:
            'As-salamu alaykum {{recipientName}}. Te esperamos este viernes para la Khutbah (12:15 PM) y oración congregacional de Jumu’ah (12:45 PM) en {{organizationName}}. Fecha Hijri: {{secondaryDate}}.',
          bodyHtml:
            '<p>As-salamu alaykum <strong>{{recipientName}}</strong>,</p><p>Te esperamos este viernes para la Khutbah (12:15 PM) y oración congregacional de <strong>Jumu’ah</strong> (12:45 PM) en {{organizationName}}.</p><p>Calendario Hijri: <em>{{secondaryDate}}</em></p>',
          ctaLabel: 'Ver Horarios de Oración',
          ctaUrl: `${siteBaseUrl}/es/prayer-times`,
          translations: {
            es: {
              subject: '🕌 Jumu’ah en {{organizationName}} ({{secondaryDate}})',
              bodyText:
                'As-salamu alaykum {{recipientName}}. Te esperamos este viernes para la Khutbah (12:15 PM) y oración congregacional de Jumu’ah (12:45 PM) en {{organizationName}}. Fecha Hijri: {{secondaryDate}}.',
              ctaLabel: 'Ver Horarios de Oración',
              ctaUrl: `${siteBaseUrl}/es/prayer-times`,
            },
            en: {
              subject: '🕌 Friday Jumu’ah Reminder — {{organizationName}} ({{secondaryDate}})',
              bodyText:
                'As-salamu alaykum {{recipientName}}. Join us this Friday for the Jumu’ah Khutbah (12:15 PM) and congregational prayer (12:45 PM) at {{organizationName}}. Hijri date: {{secondaryDate}}.',
              ctaLabel: 'View Prayer Schedule',
              ctaUrl: `${siteBaseUrl}/en/prayer-times`,
            },
            ar: {
              subject: '🕌 تذكير صلاة وخطبة الجمعة — {{organizationName}} ({{secondaryDate}})',
              bodyText:
                'السلام عليكم {{recipientName}}، ندعوكم لحضور خطبة الجمعة (12:15 ظهراً) وصلاة الجمعة (12:45 ظهراً) في {{organizationName}}. التاريخ الهجري: {{secondaryDate}}.',
              ctaLabel: 'عرض مواقيت الصلاة',
              ctaUrl: `${siteBaseUrl}/ar/prayer-times`,
            },
            tr: {
              subject: '🕌 Cuma Hutbesi ve Namazı Hatırlatması — {{organizationName}} ({{secondaryDate}})',
              bodyText:
                'Es-selamu aleyküm {{recipientName}}. Bu Cuma {{organizationName}} bünyesinde Cuma hutbesi (12:15) ve namazına (12:45) davetlisiniz. Hicri Tarih: {{secondaryDate}}.',
              ctaLabel: 'Namaz Vakitlerini Gör',
              ctaUrl: `${siteBaseUrl}/tr/prayer-times`,
            },
          },
        },
        {
          slug: 'ramadan-eid-moon-sighting',
          title: 'Comunicado Oficial de Avistamiento Lunar (Ramadán / Eid)',
          topic: 'ramadan_eid',
          channels: ['telegram', 'whatsapp', 'email'],
          priority: 'high',
          subject: '🌙 Comunicado Oficial de Avistamiento Lunar — {{organizationName}}',
          bodyText:
            'As-salamu alaykum {{recipientName}}. La Junta Directiva e Imamate de {{organizationName}} anuncian la programación especial de Iftar comunitario, Tarawih y Salat al-Eid ({{secondaryDate}}).',
          ctaLabel: 'Ver Programación de Ramadán y Eid',
          ctaUrl: `${siteBaseUrl}/es/events`,
          translations: {
            es: {
              subject: '🌙 Comunicado Oficial de Avistamiento Lunar — {{organizationName}}',
              bodyText:
                'As-salamu alaykum {{recipientName}}. La Junta Directiva e Imamate de {{organizationName}} anuncian la programación especial de Iftar comunitario, Tarawih y Salat al-Eid ({{secondaryDate}}).',
              ctaLabel: 'Ver Programación de Ramadán y Eid',
              ctaUrl: `${siteBaseUrl}/es/events`,
            },
            en: {
              subject: '🌙 Official Moon-Sighting Statement — {{organizationName}}',
              bodyText:
                'As-salamu alaykum {{recipientName}}. The Board and Imamate of {{organizationName}} announce the official community Iftar, Tarawih, and Salat al-Eid schedule ({{secondaryDate}}).',
              ctaLabel: 'View Ramadan & Eid Schedule',
              ctaUrl: `${siteBaseUrl}/en/events`,
            },
            ar: {
              subject: '🌙 بيان رسمي بشأن تحري الهلال — {{organizationName}}',
              bodyText:
                'السلام عليكم {{recipientName}}، يعلن مجلس الإدارة والإمامة في {{organizationName}} عن جدول الإفطار الجماعي وصلاة التراويح وصلاة العيد ({{secondaryDate}}).',
              ctaLabel: 'عرض برنامج رمضان والعيد',
              ctaUrl: `${siteBaseUrl}/ar/events`,
            },
            tr: {
              subject: '🌙 Resmi Hilal Gözlemi ve Ramazan/Bayram Duyurusu — {{organizationName}}',
              bodyText:
                'Es-selamu aleyküm {{recipientName}}. {{organizationName}} Yönetim Kurulu ve İmamlığı toplu iftar, teravih ve bayram namazı programını duyurur ({{secondaryDate}}).',
              ctaLabel: 'Ramazan ve Bayram Programını Gör',
              ctaUrl: `${siteBaseUrl}/tr/events`,
            },
          },
        },
        {
          slug: 'urgent-janazah-alert',
          title: 'Aviso Urgente de Oración Funeraria (Salat al-Janazah)',
          topic: 'urgent_janazah',
          channels: ['telegram', 'whatsapp', 'email'],
          priority: 'urgent',
          subject: '🕯️ Aviso Urgente: Salat al-Janazah en {{organizationName}}',
          bodyText:
            'Inna lillahi wa inna ilayhi raji’un. Informamos a la comunidad que se realizará la oración funeraria (Salat al-Janazah) en {{organizationName}} después de la oración de Dhuhr ({{secondaryDate}}).',
          ctaLabel: 'Detalles y Ubicación',
          ctaUrl: `${siteBaseUrl}/es/contact`,
          translations: {
            es: {
              subject: '🕯️ Aviso Urgente: Salat al-Janazah en {{organizationName}}',
              bodyText:
                'Inna lillahi wa inna ilayhi raji’un. Informamos a la comunidad que se realizará la oración funeraria (Salat al-Janazah) en {{organizationName}} después de la oración de Dhuhr ({{secondaryDate}}).',
              ctaLabel: 'Detalles y Ubicación',
              ctaUrl: `${siteBaseUrl}/es/contact`,
            },
            en: {
              subject: '🕯️ Urgent Community Notice: Salat al-Janazah at {{organizationName}}',
              bodyText:
                'Inna lillahi wa inna ilayhi raji’un. Funeral prayer (Salat al-Janazah) will be held at {{organizationName}} following Dhuhr prayer ({{secondaryDate}}).',
              ctaLabel: 'Details & Location',
              ctaUrl: `${siteBaseUrl}/en/contact`,
            },
            ar: {
              subject: '🕯️ إعلان عاجل: صلاة الجنازة في {{organizationName}}',
              bodyText:
                'إنا لله وإنا إليه راجعون. تُقام صلاة الجنازة في {{organizationName}} عقب صلاة الظهر ({{secondaryDate}}).',
              ctaLabel: 'التفاصيل والموقع',
              ctaUrl: `${siteBaseUrl}/ar/contact`,
            },
            tr: {
              subject: '🕯️ Acil Duyuru: {{organizationName}} Cenaze Namazı',
              bodyText:
                'İnna lillahi ve inna ileyhi raciun. Öğle namazını müteakip {{organizationName}} camiimizde cenaze namazı kılınacaktır ({{secondaryDate}}).',
              ctaLabel: 'Detaylar ve Konum',
              ctaUrl: `${siteBaseUrl}/tr/contact`,
            },
          },
        },
        {
          slug: 'new-academy-course-announcement',
          title: 'Apertura de Inscripciones: Cursos de Árabe, Tajwid y Nuevos Musulmanes',
          topic: 'courses',
          channels: ['email', 'telegram', 'whatsapp'],
          priority: 'normal',
          subject: '📚 Inscripciones Abiertas: Cursos de Árabe y Estudios Islámicos ({{secondaryDate}})',
          bodyText:
            'As-salamu alaykum {{recipientName}}. Ya están abiertas las inscripciones para el nuevo ciclo de cursos de Lengua Árabe, Tajwid del Corán y Fundamentos para Nuevos Musulmanes en {{organizationName}} ({{secondaryDate}}).',
          ctaLabel: 'Inscribirse a los Cursos',
          ctaUrl: `${siteBaseUrl}/es/islam-faith`,
        },
      ],
      presetAutomationRules: [
        {
          slug: 'auto-alert-banner-broadcast',
          name: 'Difusión Automática de Alertas Urgentes del Sitio',
          eventName: 'inbox.alert.published',
          topic: 'announcements',
          channels: ['telegram', 'whatsapp'],
          active: true,
          priority: 'urgent',
          subjectTemplate: '🚨 {{title}} — {{organizationName}}',
          bodyTextTemplate: '🚨 {{title}}: {{message}} ({{secondaryDate}})',
          ctaLabelTemplate: 'Ver Aviso Oficial',
          ctaUrlTemplate: '{{siteBaseUrl}}',
        },
        {
          slug: 'auto-event-published-broadcast',
          name: 'Difusión Automática de Nuevos Eventos Comunitarios',
          eventName: 'event.published',
          targetContentType: 'api::event.event',
          topic: 'events',
          channels: ['telegram', 'email'],
          active: true,
          priority: 'normal',
          subjectTemplate: '📅 Nuevo Evento: {{title}} ({{secondaryDate}})',
          bodyTextTemplate:
            'Nuevo evento comunitario en {{organizationName}}: {{title}}. {{summary}} ({{secondaryDate}}).',
          ctaLabelTemplate: 'Inscribirse al Evento',
          ctaUrlTemplate: '{{siteBaseUrl}}/es/events',
        },
      ],
    },
  };
}
