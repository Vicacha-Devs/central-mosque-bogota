import type { Core } from '@strapi/strapi';
import {
  notifyContactSubmission,
  notifyDonationSubmission,
  notifyVisitBooking,
} from '../utils/email-notifications';

export function registerPluginEmailLifecycles(strapi: Core.Strapi) {
  if (!strapi.db?.lifecycles?.subscribe) return;

  strapi.db.lifecycles.subscribe({
    models: [
      'plugin::inbox.submission',
      'plugin::bookings.booking',
      'plugin::donations.pledge',
    ],
    async afterCreate(event: {
      model?: { uid?: string };
      result?: Record<string, unknown>;
    }) {
      const uid = event.model?.uid;
      const result = event.result;
      if (!uid || !result) return;

      if (uid === 'plugin::inbox.submission') {
        await notifyContactSubmission(strapi, result);
      } else if (uid === 'plugin::bookings.booking') {
        await notifyVisitBooking(strapi, result);
      } else if (uid === 'plugin::donations.pledge') {
        await notifyDonationSubmission(strapi, result);
      }
    },
  });
}
