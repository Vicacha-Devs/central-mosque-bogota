import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::visit-booking.visit-booking', {
  config: {
    create: {
      middlewares: ['global::public-submission-guard'],
    },
  },
});

