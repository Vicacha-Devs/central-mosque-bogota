import { resolveAppKeys } from './security.utils';

export default ({ env }) => ({
  // Bind to 127.0.0.1 by default for local dev/testing security
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://127.0.0.1:1337'),
  app: {
    keys: resolveAppKeys('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
