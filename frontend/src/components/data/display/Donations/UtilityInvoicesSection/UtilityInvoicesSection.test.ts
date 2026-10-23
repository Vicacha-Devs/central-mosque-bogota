import { getByRole, getByText } from "@testing-library/dom";
import {
  getDonatePageStrings,
  getLocalizedUtilityInvoices,
} from "@utils/donation-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import UtilityInvoicesSection from "./UtilityInvoicesSection.astro";

describe("UtilityInvoicesSection", () => {
  it("should render utility invoices when list is provided", async () => {
    const t = getDonatePageStrings("es");
    const invoices = getLocalizedUtilityInvoices("es");
    const { root, close } = await renderAstroComponentToDom(
      UtilityInvoicesSection,
      {
        props: {
          lang: "es",
          invoices,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: t.invoicesTitle,
        })
      ).toBeInTheDocument();

      expect(getByText(root, invoices[0].title)).toBeInTheDocument();
      const firstProvider = invoices[0].provider;
      const providerEl = getByText(root, firstProvider, { exact: false });
      expect(providerEl).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
