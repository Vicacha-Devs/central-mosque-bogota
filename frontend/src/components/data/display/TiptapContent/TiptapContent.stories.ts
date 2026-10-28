import preview from "@storybook/preview";

import TiptapContent from "./TiptapContent.astro";

const meta = preview.meta({
  title: "Components/Data/Display/TiptapContent",
  component: TiptapContent,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    content: `
      <h2>Mezquita Central Abou Bakr Al-Siddiq</h2>
      <p>Fundada para servir a la <strong>comunidad musulmana de Bogotá</strong> con educación, solidaridad y diálogo interreligioso.</p>
      <blockquote>«El mejor de entre vosotros es aquel que es más beneficioso para la humanidad.»</blockquote>
      <ul>
        <li>Oraciones diarias (Salah) y Jumu'ah los viernes</li>
        <li>Visitas culturales guiadas y biblioteca islámica</li>
      </ul>
    `,
  },
});

export const Default = meta.story({});

export const ProseMirrorJSON = meta.story({
  args: {
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 3 },
          content: [
            { type: "text", text: "Programas Educativos y Culturales" },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Clases semanales de idioma árabe, Tajwid y estudios islámicos abiertas al público.",
            },
          ],
        },
        {
          type: "beforeAfterSlider",
          attrs: {
            beforeUrl:
              "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=900&q=80",
            afterUrl:
              "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=900&q=80",
            beforeAlt: "Construcción (2011)",
            afterAlt: "Actualidad (2026)",
            caption:
              "Evolución arquitectónica de la Mezquita Central Abou Bakr Al-Siddiq.",
          },
        },
      ],
    },
  },
});
