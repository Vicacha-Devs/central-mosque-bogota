import preview from "@storybook/preview";
import { getDetailedArticles } from "@utils/localized-mocks";

import ArticleDetailSection from "./ArticleDetailSection.astro";

const esArticles = getDetailedArticles("es");
const enArticles = getDetailedArticles("en");
const arArticles = getDetailedArticles("ar");
const trArticles = getDetailedArticles("tr");

const meta = preview.meta({
  title: "Components/Data/Display/Academy/ArticleDetailSection",
  component: ArticleDetailSection,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    lang: "es",
    article: esArticles[0],
    relatedArticles: esArticles.slice(1),
  },
});

export const Default = meta.story({});

export const EnglishLocale = meta.story({
  args: {
    lang: "en",
    article: enArticles[0],
    relatedArticles: enArticles.slice(1),
  },
});

export const ArabicLocale = meta.story({
  args: {
    lang: "ar",
    article: arArticles[0],
    relatedArticles: arArticles.slice(1),
  },
});

export const TurkishLocale = meta.story({
  args: {
    lang: "tr",
    article: trArticles[0],
    relatedArticles: trArticles.slice(1),
  },
});
