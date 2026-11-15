import type { ComponentProps } from "astro/types";

import MediaArchiveSection from "./MediaArchiveSection.astro";

type MediaArchiveSectionProps = ComponentProps<typeof MediaArchiveSection>;

export default {
  component: MediaArchiveSection,
  title: "Data/Display/Media/MediaArchiveSection",
};

export const Default = {
  args: {
    lang: "es",
  } satisfies MediaArchiveSectionProps,
};
