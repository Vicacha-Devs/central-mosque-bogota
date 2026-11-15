import { useTranslations } from "@i18n/utils";
import { getByRole, getByText } from "@testing-library/dom";
import { getLocalizedDonationCampaigns } from "@utils/institutional-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import DonationCampaignsSection from "./DonationCampaignsSection.astro";

describe("DonationCampaignsSection", () => {
  it("should render campaigns when list is provided", async () => {
    const t = useTranslations("en");
    const campaigns = getLocalizedDonationCampaigns("en");
    const { root, close } = await renderAstroComponentToDom(
      DonationCampaignsSection,
      {
        props: {
          lang: "en",
          campaigns,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: t("donate-page.campaignsTitle"),
        })
      ).toBeInTheDocument();

      expect(getByText(root, campaigns[0].title)).toBeInTheDocument();
      expect(getByText(root, campaigns[0].description)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
