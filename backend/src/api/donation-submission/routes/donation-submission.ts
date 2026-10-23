import { factories } from '@strapi/strapi';

export default factories.createCoreRouter(
  'api::donation-submission.donation-submission',
  {
    config: {
      create: {
        middlewares: ['global::public-submission-guard'],
      },
    },
  }
);
