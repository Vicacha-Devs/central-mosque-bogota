import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import CourseEnrollmentForm from "./CourseEnrollmentForm.astro";

describe("CourseEnrollmentForm", () => {
  it("should render enrollment form when props are passed", async () => {
    const { root, close } = await renderAstroComponentToDom(
      CourseEnrollmentForm,
      {
        props: {
          courseTitle: "Introducción al Árabe Coránico",
        },
      }
    );

    try {
      expect(
        getByText(root, "Inscripción al Curso / Solicitud de Guía")
      ).toBeInTheDocument();
      const form = root.querySelector("#course-enrollment-form");
      expect(form?.getAttribute("data-course-title")).toBe(
        "Introducción al Árabe Coránico"
      );
      expect(
        getByRole(root, "button", { name: /Enviar Inscripción/i })
      ).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
