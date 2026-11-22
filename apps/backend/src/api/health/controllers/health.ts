export default {
  async check(ctx: any) {
    try {
      await strapi.db.connection.raw('SELECT 1');
      ctx.status = 200;
      ctx.body = {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      strapi.log?.error?.(
        '[health] Database connectivity check failed:',
        err instanceof Error ? err.message : String(err)
      );
      // Never expose raw database error messages or stack traces to callers
      ctx.status = 503;
      ctx.body = {
        status: 'degraded',
        database: 'unavailable',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
