import { getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import RamadanTimeSlotCard from "./RamadanTimeSlotCard.astro";

describe("RamadanTimeSlotCard", () => {
  it("should render time slot card when slot is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(
      RamadanTimeSlotCard,
      {
        props: {
          icon: "restaurant",
          label: "Iftar (Maghrib)",
          time: "06:06 PM",
          featured: true,
        },
      }
    );

    try {
      expect(getByText(root, "Iftar (Maghrib)")).toBeInTheDocument();
      expect(getByText(root, "06:06 PM")).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
