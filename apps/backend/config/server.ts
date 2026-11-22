import { resolveAppKeys } from './security.utils';

export default ({ env }) => {
  // Bind to 127.0.0.1 by default for local dev/testing security
  const host = env('HOST', '127.0.0.1');
  const port = env.int('PORT', 1337);

  const publicHost = host === '0.0.0.0' ? '127.0.0.1' : host;

  return {
    host,
    port,
    url: env('PUBLIC_URL', `http://${publicHost}:${port}`),
    proxy: env.bool('TRUST_PROXY', false),
    app: {
      keys: resolveAppKeys('APP_KEYS'),
    },
    // TODO(strapi-5.60+): If enabling Vercel ISR or CDN caching on apps/frontend (or external
    // notification hooks), configure granular per-content-type webhook events in Settings -> Webhooks
    // (e.g., publish/unpublish/delete only for public content types, excluding submissions/bookings/logs).
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};
