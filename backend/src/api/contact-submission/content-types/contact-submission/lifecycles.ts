import { notifyContactSubmission } from '../../../../utils/email-notifications';

export default {
  async afterCreate(event: { result?: Record<string, unknown> }) {
    if (!event.result) return;
    await notifyContactSubmission(strapi, event.result);
  },
};
