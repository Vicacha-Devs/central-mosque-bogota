import { createTestDom } from "@utils/test.helpers";
import { describe, expect, it, vi } from "vitest";

import { initCopyDuaButtons } from "./daily-dua-modal.controller";

describe("initCopyDuaButtons", () => {
  it("should copy Dua text to clipboard when copy button is clicked", async () => {
    const { root, close } = createTestDom(`
      <button
        type="button"
        data-copy-dua="Rabbanā ātinā"
        data-copy-label="Copiar súplica"
        data-copied-label="¡Copiado!"
      >
        <span data-copy-dua-text>Copiar súplica</span>
      </button>
    `);

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    try {
      initCopyDuaButtons(root);

      const btn = root.querySelector<HTMLButtonElement>("[data-copy-dua]");
      btn?.click();

      await vi.waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith("Rabbanā ātinā");
        expect(root.querySelector("[data-copy-dua-text]")?.textContent).toBe(
          "¡Copiado!"
        );
      });
    } finally {
      await close();
    }
  });
});
