import { notifyDonationSubmission } from '../../../../utils/email-notifications';

export default {
  async afterCreate(event: { result?: Record<string, unknown> }) {
    if (!event.result) return;
    await notifyDonationSubmission(strapi, event.result);
  },
};
