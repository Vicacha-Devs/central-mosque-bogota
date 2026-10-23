import { useTranslations } from "@i18n/utils";
import { getByRole, getByText } from "@testing-library/dom";
import { getLocalizedPaymentMethods } from "@utils/institutional-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import PaymentChannelsSection from "./PaymentChannelsSection.astro";

describe("PaymentChannelsSection", () => {
  it("should render payment channels when list is provided", async () => {
    const t = useTranslations("en");
    const methods = getLocalizedPaymentMethods("en");
    const { root, close } = await renderAstroComponentToDom(
      PaymentChannelsSection,
      {
        props: {
          lang: "en",
          methods,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: t("donate-page.channelsTitle"),
        })
      ).toBeInTheDocument();

      expect(getByText(root, methods[0].providerName)).toBeInTheDocument();
      expect(getByText(root, methods[0].instructions)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
