import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::contact-submission.contact-submission',
  () => ({
    async create(ctx) {
      if (ctx.request?.body?.data && typeof ctx.request.body.data === 'object') {
        ctx.request.body.data.status = 'new';
      }
      return await super.create(ctx);
    },
  })
);

