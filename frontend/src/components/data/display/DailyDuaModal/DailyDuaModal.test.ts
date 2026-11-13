import { getByText } from "@testing-library/dom";
import { getLocalizedMocks } from "@utils/localized-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import DailyDuaModal from "./DailyDuaModal.astro";

describe("DailyDuaModal", () => {
  it("should render daily dua modal when dua is provided", async () => {
    const dua = getLocalizedMocks("es").dailyDua;
    const { root, close } = await renderAstroComponentToDom(DailyDuaModal, {
      props: { dua },
    });

    try {
      expect(getByText(root, dua.arabic)).toBeInTheDocument();
      expect(getByText(root, dua.source)).toBeInTheDocument();
      expect(getByText(root, "Leer Súplica del Día")).toBeInTheDocument();
      expect(getByText(root, "Copiar Súplica")).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
