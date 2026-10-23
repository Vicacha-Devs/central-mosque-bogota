import { getByRole, getByText } from "@testing-library/dom";
import { getDetailedArticles } from "@utils/localized-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import ArticleDetailSection from "./ArticleDetailSection.astro";

describe("ArticleDetailSection", () => {
  it("should render article detail when props are passed", async () => {
    const articles = getDetailedArticles("en");
    const [article, ...relatedArticles] = articles;

    const { root, close } = await renderAstroComponentToDom(
      ArticleDetailSection,
      {
        props: {
          lang: "en",
          article,
          relatedArticles,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          level: 1,
          name: article.title,
        })
      ).toBeInTheDocument();
      expect(getByText(root, article.authorName)).toBeInTheDocument();
      const firstObjective = article.learningObjectives[0];
      expect(getByText(root, firstObjective)).toBeInTheDocument();
      expect(getByText(root, relatedArticles[0].title)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
