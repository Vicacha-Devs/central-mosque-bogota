import { getByRole } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import LanguagePicker from "./LanguagePicker.astro";

describe("LanguagePicker", () => {
  it("should render language links when picker mounts", async () => {
    const { root, close } = await renderAstroComponentToDom(LanguagePicker, {
      props: {
        side: "bottom",
        align: "end",
      },
    });

    try {
      const triggerButton = getByRole(root, "button");
      expect(triggerButton).toBeInTheDocument();

      const languageLinks = root.querySelectorAll("a[href^=\u0022/\u0022]");
      expect(languageLinks.length).toBeGreaterThanOrEqual(4);
    } finally {
      await close();
    }
  });
});
