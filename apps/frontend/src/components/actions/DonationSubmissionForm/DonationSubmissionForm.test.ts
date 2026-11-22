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

  it("should render CMS-provided options when backend config is passed", async () => {
    const t = getDonatePageStrings("en");
    const { root, close } = await renderAstroComponentToDom(
      DonationSubmissionForm,
      {
        props: {
          lang: "en",
          currencies: ["COP", "USD"],
          categories: [{ key: "zakat", label: "Zakat Al-Mal (CMS)" }],
          paymentMethods: [{ key: "wompi", providerName: "Wompi PSE (CMS)" }],
          campaigns: [{ slug: "ramadan-2026", title: "Ramadan Fund" }],
        },
      }
    );

    try {
      const docTypeOptions = Array.from(
        root.querySelectorAll("#donor-doc-type option")
      ).map((o) => o.textContent.trim());
      expect(docTypeOptions).toContain(t.docTypeOptions[0].label);

      const currencyOptions = Array.from(
        root.querySelectorAll("#donation-currency option")
      ).map((o) => o.getAttribute("value"));
      expect(currencyOptions).toEqual(["COP", "USD"]);

      const categoryOptions = Array.from(
        root.querySelectorAll("#donation-type option")
      ).map((o) => ({
        value: o.getAttribute("value"),
        label: o.textContent.trim(),
      }));
      expect(categoryOptions).toEqual([
        { value: "zakat", label: "Zakat Al-Mal (CMS)" },
      ]);

      const methodOptions = Array.from(
        root.querySelectorAll("#donation-method option")
      ).map((o) => ({
        value: o.getAttribute("value"),
        label: o.textContent.trim(),
      }));
      expect(methodOptions).toEqual([
        { value: "wompi", label: "Wompi PSE (CMS)" },
        { value: "other", label: t.methodOther },
      ]);

      const campaignText =
        root.querySelector(
          '#donation-campaign-slug option[value="ramadan-2026"]'
        )?.textContent ?? "";
      expect(campaignText).toContain(t.campaignOptionPrefix);
      expect(campaignText).toContain("Ramadan Fund");
    } finally {
      await close();
    }
  });
});
