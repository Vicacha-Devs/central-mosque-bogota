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
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};
