import path from 'node:path';

// TODO(security): Enforce mTLS client certificates (ssl.ca, ssl.cert, ssl.key) for PostgreSQL connections in production.

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  const databaseUrl = env('DATABASE_URL', '');

  const connections = {
    postgres: {
      connection: {
        ...(databaseUrl
          ? { connectionString: databaseUrl }
          : {
              host: env('DATABASE_HOST', '127.0.0.1'),
              port: env.int('DATABASE_PORT', 5432),
              database: env('DATABASE_NAME', 'central_mosque_strapi'),
              // Least privilege dedicated application user (not root/postgres)
              user: env('DATABASE_USERNAME', 'mosque_app_user'),
              password: env('DATABASE_PASSWORD', ''),
            }),
        ssl: env.bool('DATABASE_SSL', process.env.NODE_ENV === 'production') && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
        idleTimeoutMillis: env.int('DATABASE_POOL_IDLE_TIMEOUT_MS', 30000),
        createTimeoutMillis: env.int('DATABASE_POOL_CREATE_TIMEOUT_MS', 10000),
        reapIntervalMillis: env.int('DATABASE_POOL_REAP_INTERVAL_MS', 1000),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(
          typeof __dirname !== 'undefined'
            ? path.join(__dirname, '..', '..')
            : process.cwd(),
          env('DATABASE_FILENAME', '.tmp/data.db')
        ),
      },
      useNullAsDefault: true,
      pool: {
        afterCreate: (
          conn: { pragma?: (sql: string) => void },
          done: (err: Error | null, connection: unknown) => void
        ) => {
          try {
            conn?.pragma?.('journal_mode = WAL');
            conn?.pragma?.('busy_timeout = 5000');
            conn?.pragma?.('synchronous = NORMAL');
            done(null, conn);
          } catch (err) {
            done(err instanceof Error ? err : new Error(String(err)), conn);
          }
        },
      },
    },
  };

  if (!(client in connections)) {
    throw new Error(
      `Unsupported DATABASE_CLIENT "${client}". Expected one of: ${Object.keys(connections).join(', ')}`
    );
  }

  return {
    connection: {
      client,
      ...connections[client as keyof typeof connections],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
