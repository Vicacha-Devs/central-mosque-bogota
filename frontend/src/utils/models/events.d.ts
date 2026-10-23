export type TEventPosterAsset = {
  /**
   * Safe relative or https/http URL to the poster image or document.
   */
  url: string;
  /**
   * Accessible alt text for the poster.
   */
  alt?: string;
  /**
   * MIME type (e.g. "image/svg+xml", "image/webp", "image/jpeg").
   */
  mime?: string;
  /**
   * Intrinsic width in pixels if available.
   */
  width?: number;
  /**
   * Intrinsic height in pixels if available.
   */
  height?: number;
};

export type TEventActionLinkVariant = "primary" | "secondary" | "outline";

export type TEventActionLink = {
  /**
   * Human-readable CTA button or resource link label.
   */
  label: string;
  /**
   * Safe destination URL (`https://`, `http://`, `mailto:`, or relative `/path`).
   */
  url: string;
  /**
   * Visual button style variant.
   */
  variant?: TEventActionLinkVariant;
  /**
   * Whether the link opens in a new tab with `rel="noopener noreferrer"`.
   */
  external?: boolean;
  /**
   * Optional Material Symbols icon name.
   */
  icon?: string;
};

export type TEventSpotlightPosition = "bottom-end" | "bottom-start";

export type TEventSpotlightConfig = {
  /**
   * Whether this event is promoted in the floating Spotlight corner dock.
   */
  enabled: boolean;
  /**
   * Optional generic badge label (e.g. "Convocatoria Abierta", "Featured", "Open Registration").
   */
  badgeText?: string;
  /**
   * Sorting priority in the dock when multiple spotlights are active (higher = first).
   */
  priority?: number;
  /**
   * Logical corner placement (supports LTR and RTL layouts).
   */
  position?: TEventSpotlightPosition;
  /**
   * Whether to display a live remaining-days countdown badge until `endAt`.
   */
  showCountdown?: boolean;
  /**
   * Optional ISO date/datetime when the spotlight starts appearing.
   */
  startAt?: string;
  /**
   * Optional ISO date/datetime when the spotlight stops appearing.
   */
  endAt?: string;
};

export type TEvent = {
  /**
   * Short label displayed above the title (e.g. "Educación", "Conferencia", "Clase").
   */
  category: string;
  /**
   * Main card heading.
   */
  title: string;
  /**
   * Supporting summary text shown under the title.
   */
  description: string;
  /**
   * Human-readable schedule string (e.g. "Sáb 15 Oct · 10:00" or "Every Friday · 18:00").
   */
  schedule: string;
  /**
   * Physical location where the event takes place.
   */
  location: string;
  /**
   * URL to the event's full details page.
   */
  url: string;
  /**
   * URL to the event's image or thumbnail.
   */
  image: string;
  /**
   * Date of the event in `{ month: string; day: number; }` format.
   * month: Short month name (e.g. "Oct")
   * day: Day of the month (e.g. 15)
   */
  date: {
    month: string;
    day: number;
  };
  /**
   * Optional high-resolution vertical poster asset for flyers/announcements.
   */
  poster?: TEventPosterAsset;
  /**
   * Optional list of generic CTA / resource links associated with the event.
   */
  actionLinks?: Array<TEventActionLink>;
  /**
   * Optional floating corner spotlight popup configuration.
   */
  spotlightConfig?: TEventSpotlightConfig;
};

export type TEventSpotlight = {
  /**
   * Stable unique identifier for persistence in `localStorage`.
   */
  id: string;
  /**
   * Short tab label when multiple spotlights are active in the dock.
   */
  tabLabel: string;
  /**
   * Category label.
   */
  category: string;
  /**
   * Main event heading.
   */
  title: string;
  /**
   * Concise summary shown in the floating card and lightbox.
   */
  summary: string;
  /**
   * Human-readable schedule / window string.
   */
  schedule: string;
  /**
   * Location or portal label.
   */
  location: string;
  /**
   * Poster media asset.
   */
  poster: TEventPosterAsset;
  /**
   * Structured CTA / resource action links.
   */
  actionLinks: Array<TEventActionLink>;
  /**
   * Spotlight display configuration.
   */
  spotlightConfig: TEventSpotlightConfig;
};
