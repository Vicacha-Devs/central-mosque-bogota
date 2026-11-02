import { getAllByRole, getByLabelText, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import ZakatCalculatorSection from "./ZakatCalculatorSection.astro";

describe("ZakatCalculatorSection", () => {
  it("should render zakat tabs when nisab is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(
      ZakatCalculatorSection,
      {
        props: {
          lang: "es",
          goldWeightGrams: 85,
          goldNisabAmount: 32725000,
          silverWeightGrams: 595,
          silverNisabAmount: 2618000,
        },
      }
    );

    try {
      const tabs = getAllByRole(root, "tab");
      expect(tabs).toHaveLength(2);
      expect(tabs[0]).toHaveTextContent("Zakat al-Mal (2.5% Patrimonio)");
      expect(tabs[1]).toHaveTextContent("Zakat al-Fitr, Fidyah y Kaffarah");

      expect(
        getByLabelText(root, "Miembros del hogar para Zakat al-Fitr (Fitrana)")
      ).toBeInTheDocument();
      expect(
        getByText(root, "Usar este monto en el Formulario de Donación")
      ).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
