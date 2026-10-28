import { resolveAppKeys } from './security.utils';

export default ({ env }) => {
  // Bind to 127.0.0.1 by default for local dev/testing security
  const host = env('HOST', '127.0.0.1');
  const port = env.int('PORT', 1337);

  return {
    host,
    port,
    url: env('PUBLIC_URL', `http://${host}:${port}`),
    app: {
      keys: resolveAppKeys('APP_KEYS'),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};
