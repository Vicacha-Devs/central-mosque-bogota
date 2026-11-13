import { getByRole, getByText } from "@testing-library/dom";
import { getLocalizedUtilityInvoices } from "@utils/donation-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import UtilityInvoiceCard from "./UtilityInvoiceCard.astro";

describe("UtilityInvoiceCard", () => {
  it("should render invoice card when invoice is provided", async () => {
    const [invoice] = getLocalizedUtilityInvoices("es");

    const { root, close } = await renderAstroComponentToDom(
      UtilityInvoiceCard,
      {
        props: {
          lang: "es",
          invoice,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", { name: invoice.title })
      ).toBeInTheDocument();
      const providerEl = getByText(root, invoice.provider, { exact: false });
      expect(providerEl).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
