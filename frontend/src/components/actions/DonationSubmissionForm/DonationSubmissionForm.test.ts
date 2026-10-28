import { getByRole } from "@testing-library/dom";
import { getDonatePageStrings } from "@utils/donation-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import DonationSubmissionForm from "./DonationSubmissionForm.astro";

describe("DonationSubmissionForm", () => {
  it("should render donation form when props are passed", async () => {
    const t = getDonatePageStrings("es");
    const { root, close } = await renderAstroComponentToDom(
      DonationSubmissionForm,
      {
        props: {
          lang: "es",
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: t.formTitle,
        })
      ).toBeInTheDocument();

      const donorNameInput = root.querySelector("#donor-name");
      expect(donorNameInput).not.toBeNull();

      const donorEmailInput = root.querySelector("#donor-email");
      expect(donorEmailInput).not.toBeNull();

      const formElement = root.querySelector("#donation-form");
      expect(formElement).not.toBeNull();
    } finally {
      await close();
    }
  });
});
