import { getByRole } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import Welcome from "./Welcome.astro";

describe("Welcome", () => {
  it("should render welcome links when component mounts", async () => {
    const { root, close } = await renderAstroComponentToDom(Welcome);

    try {
      expect(
        getByRole(root, "heading", {
          name: /What's New in Astro 5\.0\?/i,
        })
      ).toBeInTheDocument();

      expect(
        getByRole(root, "link", {
          name: /Read our docs/i,
        })
      ).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
