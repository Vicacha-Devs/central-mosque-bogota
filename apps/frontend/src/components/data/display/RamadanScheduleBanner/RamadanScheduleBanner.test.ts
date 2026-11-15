import { getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import RamadanScheduleBanner from "./RamadanScheduleBanner.astro";

describe("RamadanScheduleBanner", () => {
  it("should render ramadan schedule when active", async () => {
    const { root, close } = await renderAstroComponentToDom(
      RamadanScheduleBanner,
      {
        props: {
          suhoorTime: "04:42 AM",
          iftarTime: "06:06 PM",
          taraweehTime: "07:30 PM",
        },
      }
    );

    try {
      expect(getByText(root, "04:42 AM")).toBeInTheDocument();
      expect(getByText(root, "06:06 PM")).toBeInTheDocument();
      expect(getByText(root, "07:30 PM")).toBeInTheDocument();
      expect(
        getByText(root, "Patrocinar Cenas de Iftar Comunitario")
      ).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
