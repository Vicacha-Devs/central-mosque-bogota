import { GENERAL_CONTACT_PRESET_FORM } from './inbox-presets/general-contact.preset';
import { SERVICE_DESK_APPLICATION_PRESET_FORM } from './inbox-presets/service-desk.preset';

type EnvFn = {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
};

export function buildMosqueInboxPluginConfig(env: EnvFn) {
  return {
    enabled: true,
    config: {
      primaryCalendar: 'gregory',
      secondaryCalendars: ['islamic-umalqura'],
      defaultLocale: 'es',
      supportedLocales: ['es', 'en', 'ar', 'tr'],
      defaultRateLimitPerHour: env.int('INBOX_RATE_LIMIT_PER_HOUR', 15),
      defaultHoneypotField: '_website_url',
      defaultCaptchaProvider: env('INBOX_CAPTCHA_PROVIDER', 'none'),
      turnstileSiteKey: env('TURNSTILE_SITE_KEY', ''),
      turnstileSecretKey: env('TURNSTILE_SECRET_KEY', ''),
      recaptchaSiteKey: env('RECAPTCHA_SITE_KEY', ''),
      recaptchaSecretKey: env('RECAPTCHA_SECRET_KEY', ''),
      enableDoubleOptIn: env.bool('INBOX_DOUBLE_OPT_IN', true),
      availableTopics: [
        'announcements',
        'events',
        'courses',
        'ramadan_eid',
        'newsletter',
      ],
      availableDepartments: [
        'general',
        'imamate',
        'nikah_family',
        'new_muslims',
        'halal_certification',
        'janazah_urgent',
        'social_aid',
        'guided_visits',
      ],
      enableFormBuilderBridge: true,
      autoSyncFormBuilderForms: true,
      enableBookingBridge: true,
      enableCertificateBridge: true,
      defaultNotifyEmails: [
        env('MOSQUE_INBOX_EMAIL', 'info@mezquitabogota.org'),
        env('MOSQUE_IMAM_EMAIL', 'imam@mezquitabogota.org'),
      ],
      outboundWebhookUrl: env('INBOX_OUTBOUND_WEBHOOK_URL', ''),
      presetForms: [
        GENERAL_CONTACT_PRESET_FORM,
        SERVICE_DESK_APPLICATION_PRESET_FORM,
      ],
    },
  };
}
