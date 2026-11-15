import { getByRole, getByText } from "@testing-library/dom";
import { getLocalizedGlossaryTerms } from "@utils/resources-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import GlossaryTermCard from "./GlossaryTermCard.astro";

describe("GlossaryTermCard", () => {
  it("should render glossary card when term is provided", async () => {
    const [term] = getLocalizedGlossaryTerms("es");

    const { root, close } = await renderAstroComponentToDom(GlossaryTermCard, {
      props: {
        term,
      },
    });

    try {
      expect(
        getByRole(root, "heading", { name: term.term })
      ).toBeInTheDocument();
      expect(getByText(root, term.nativeScript)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
