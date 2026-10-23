import { factories } from '@strapi/strapi';

export default factories.createCoreRouter(
  'api::contact-submission.contact-submission',
  {
    config: {
      create: {
        middlewares: ['global::public-submission-guard'],
      },
    },
  }
);

