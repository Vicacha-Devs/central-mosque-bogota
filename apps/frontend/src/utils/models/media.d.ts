export type TMediaProvider =
  | "youtube"
  | "spotify"
  | "apple_podcasts"
  | "vimeo"
  | "soundcloud"
  | "direct"
  | "upload";

export type TMediaLanguageTrack = {
  locale: string;
  label: string;
  audioUrl?: string;
  transcriptUrl?: string;
};

export type TMediaHighlight = {
  /**
   * Title of the media highlight.
   */
  title: string;
  /**
   * URL of the media highlight.
   */
  href: string;
  /**
   * URL of the image highlight.
   */
  imageUrl: string;
  /**
   * Alt text for the image highlight.
   */
  imageAlt: string;
};

export type TDetailedMediaItem = {
  slug: string;
  type: "khutbah" | "podcast" | "video";
  typeLabel: string;
  provider: TMediaProvider;
  providerLabel: string;
  externalId?: string;
  embedUrl?: string;
  watchUrl: string;
  title: string;
  description: string;
  speakerName: string;
  duration: string;
  publishedDate: string;
  hijriDate?: string;
  spokenLanguages: Array<string>;
  languageTracks?: Array<TMediaLanguageTrack>;
  href: string;
  imageUrl: string;
  imageAlt: string;
};
