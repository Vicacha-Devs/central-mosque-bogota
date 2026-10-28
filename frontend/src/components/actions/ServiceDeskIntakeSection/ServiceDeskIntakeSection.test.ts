import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import ServiceDeskIntakeSection from "./ServiceDeskIntakeSection.astro";

describe("ServiceDeskIntakeSection", () => {
  it("should render service desk categories and intake form when rendered", async () => {
    const { root, close } = await renderAstroComponentToDom(
      ServiceDeskIntakeSection,
      {
        props: {
          lang: "es",
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          name: /Radicación de Solicitudes y Lista de Requisitos/i,
        })
      ).toBeInTheDocument();

      expect(
        getByText(
          root,
          /Datos de dos testigos musulmanes y del Wali \(tutor matrimonial\)/i
        )
      ).toBeInTheDocument();

      const serviceSelect =
        root.querySelector<HTMLSelectElement>("#sd-service-type");
      expect(serviceSelect).not.toBeNull();
      expect(serviceSelect?.options.length).toBe(5);

      const submitButton = getByRole(root, "button", {
        name: /Radicar Solicitud con Código de Seguimiento/i,
      });
      expect(submitButton).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
