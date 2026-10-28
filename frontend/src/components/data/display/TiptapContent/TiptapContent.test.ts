import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import TiptapContent from "./TiptapContent.astro";

describe("TiptapContent (astro-tiptap-blocks integration)", () => {
  it("should render HTML blocks when string is provided", async () => {
    const html = `
      <h2>Historia de la Mezquita</h2>
      <p>Fundada con el apoyo de la <strong>comunidad musulmana</strong> de <a href="https://mezquitabogota.org/es">Bogotá</a>.</p>
      <ul><li>Oraciones diarias</li><li>Visitas guiadas</li></ul>
    `;

    const { root, close } = await renderAstroComponentToDom(TiptapContent, {
      props: { content: html },
    });

    try {
      const heading = getByRole(root, "heading", {
        level: 2,
        name: "Historia de la Mezquita",
      });
      expect(heading).toBeInTheDocument();

      expect(root.querySelector("[data-slot=\u0022prose\u0022]")).toBeInTheDocument();

      const strongText = getByText(root, "comunidad musulmana");
      expect(strongText).toHaveClass("font-bold");

      const link = getByRole(root, "link", { name: "Bogotá" });
      expect(link.getAttribute("href")).toBe("https://mezquitabogota.org/es");

      expect(getByText(root, "Oraciones diarias")).toBeInTheDocument();
      expect(getByText(root, "Visitas guiadas")).toBeInTheDocument();
    } finally {
      await close();
    }
  });

  it("should sanitize unsafe links when AST is provided", async () => {
    const doc = {
      type: "doc" as const,
      content: [
        {
          type: "heading" as const,
          attrs: { level: 3 as const },
          content: [{ type: "text" as const, text: "Servicios Comunitarios" }],
        },
        {
          type: "paragraph" as const,
          content: [
            {
              type: "text" as const,
              text: "Enlace seguro",
              marks: [
                {
                  type: "link" as const,
                  attrs: { href: "javascript:alert(1)" },
                },
              ],
            },
          ],
        },
      ],
    };

    const { root, close } = await renderAstroComponentToDom(TiptapContent, {
      props: { content: doc },
    });

    try {
      expect(getByRole(root, "heading", { level: 3, name: "Servicios Comunitarios" })).toBeInTheDocument();

      const link = getByRole(root, "link", { name: "Enlace seguro" });
      expect(link.getAttribute("href")).toBe("#");
    } finally {
      await close();
    }
  });

  it("should render BeforeAfterSlider when beforeAfterSlider custom block is present", async () => {
    const doc = {
      type: "doc" as const,
      content: [
        {
          type: "beforeAfterSlider",
          attrs: {
            beforeUrl: "https://cms.mezquitabogota.org/uploads/before.jpg",
            afterUrl: "https://cms.mezquitabogota.org/uploads/after.jpg",
            beforeAlt: "Antes (2011)",
            afterAlt: "Después (2026)",
            caption: "Comparación de la fachada principal",
          },
        },
      ],
    };

    const { root, close } = await renderAstroComponentToDom(TiptapContent, {
      props: { content: doc },
    });

    try {
      expect(root.querySelector("img-comparison-slider")).toBeInTheDocument();
      expect(getByText(root, "Comparación de la fachada principal")).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
