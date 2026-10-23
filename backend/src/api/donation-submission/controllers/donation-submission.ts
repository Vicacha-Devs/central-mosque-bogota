import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::donation-submission.donation-submission',
  () => ({
    async create(ctx) {
      if (ctx.request?.body?.data && typeof ctx.request.body.data === 'object') {
        ctx.request.body.data.status = 'pending';
      }
      return await super.create(ctx);
    },
  })
);
