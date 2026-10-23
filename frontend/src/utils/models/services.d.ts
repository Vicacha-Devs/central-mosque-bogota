export type TCommunityService = {
  /**
   * Icon of the community service
   */
  icon: string;
  /**
   * Title of the community service
   */
  title: string;
  /**
   * Description of the community service
   */
  description: string;
  /**
   * Optional rich text description from Strapi Tiptap editor
   */
  longDescription?: string;
};
