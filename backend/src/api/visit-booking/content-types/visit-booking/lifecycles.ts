import { notifyVisitBooking } from '../../../../utils/email-notifications';

export default {
  async afterCreate(event: { result?: Record<string, unknown> }) {
    if (!event.result) return;
    await notifyVisitBooking(strapi, event.result);
  },
};
