import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import SiteSearchSection from "./SiteSearchSection.astro";

describe("SiteSearchSection", () => {
  it("should render search section when items are passed", async () => {
    const { root, close } = await renderAstroComponentToDom(SiteSearchSection, {
      props: {
        items: [
          {
            id: "article-1",
            category: "article",
            categoryLabel: "Academia",
            title: "Introducción al Árabe Coránico",
            description: "Curso fundacional de lectura coránica.",
            href: "/es/articles/introduccion-al-arabe-coranico",
            icon: "school",
          },
        ],
      },
    });

    try {
      expect(getByRole(root, "searchbox")).toBeInTheDocument();
      expect(
        getByText(root, "Introducción al Árabe Coránico")
      ).toBeInTheDocument();
      expect(
        getByRole(root, "button", { name: "Academia y Artículos" })
      ).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
