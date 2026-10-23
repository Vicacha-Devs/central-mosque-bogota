import { createTestDom } from "@utils/test.helpers";
import html2canvas from "html2canvas-pro";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  computeLetterPortraitPlacement,
  initDownloadPdfButtons,
} from "./download-pdf.controller";

const addImageMock = vi.fn();
const saveMock = vi.fn();

vi.mock("html2canvas-pro", () => ({
  default: vi.fn(),
}));

vi.mock("jspdf", () => ({
  jsPDF: vi.fn().mockImplementation(function () {
    return {
      addImage: addImageMock,
      save: saveMock,
    };
  }),
}));

describe("download-pdf.controller", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("should scale down and keep the image within the printable area when the image is wider than the page", () => {
    const marginMm = 10;
    const pageWidthMm = 215.9;
    const pageHeightMm = 279.4;

    const placement = computeLetterPortraitPlacement({
      imageWidthPx: 2000,
      imageHeightPx: 1000,
      marginMm,
      pageWidthMm,
      pageHeightMm,
    });

    const innerWidthMm = pageWidthMm - marginMm * 2;
    const innerHeightMm = pageHeightMm - marginMm * 2;

    expect(placement.widthMm).toBeLessThanOrEqual(innerWidthMm + 1e-6);
    expect(placement.heightMm).toBeLessThanOrEqual(innerHeightMm + 1e-6);
    expect(placement.xMm).toBeGreaterThanOrEqual(marginMm - 1e-6);
    expect(placement.yMm).toBeGreaterThanOrEqual(marginMm - 1e-6);
    const maxX = pageWidthMm - marginMm + 1e-6;
    const maxY = pageHeightMm - marginMm + 1e-6;
    expect(placement.xMm + placement.widthMm).toBeLessThanOrEqual(maxX);
    expect(placement.yMm + placement.heightMm).toBeLessThanOrEqual(maxY);

    expect(placement.widthMm).toBeCloseTo(innerWidthMm, 4);
  });

  it("should center the image when there is extra vertical space inside the page", () => {
    const placement = computeLetterPortraitPlacement({
      imageWidthPx: 2000,
      imageHeightPx: 1000,
      marginMm: 10,
    });

    expect(placement.xMm).toBeCloseTo(10, 6);
    expect(placement.yMm).toBeGreaterThan(10);
  });

  it("should alert when target element is missing and generate PDF when target exists", async () => {
    const alertMock = vi.fn();
    vi.stubGlobal("alert", alertMock);

    vi.mocked(html2canvas).mockImplementation((el, opts) => {
      const dlBtn = el.querySelector("[data-action='download-pdf']");
      const moreBtn = el.querySelector("[data-action='show-more']");
      if (dlBtn) opts?.ignoreElements?.(dlBtn);
      if (moreBtn) opts?.ignoreElements?.(moreBtn);
      opts?.ignoreElements?.(el);

      return Promise.resolve({
        width: 800,
        height: 1000,
        toDataURL: () => "data:image/jpeg;base64,abc",
      } as unknown as HTMLCanvasElement);
    });

    const { root, close } = createTestDom(`
      <button id="btn-missing" data-action="download-pdf" data-target-attr="data-missing"></button>
      <button
        id="btn-valid"
        data-action="download-pdf"
        data-pdf-margin-mm="12"
        data-document-title="Calendario 2026"
      ></button>
      <button
        id="btn-neg"
        data-action="download-pdf"
        data-pdf-margin-mm="-5"
      ></button>
      <button
        id="btn-nan"
        data-action="download-pdf"
        data-pdf-margin-mm="abc"
      ></button>
      <div data-document-prayer-calendar-table>
        <div data-monthly-table-root data-monthly-table-state="collapsed"></div>
        <div data-monthly-table-root></div>
        <div data-monthly-table-clip style="max-height: 200px;"></div>
        <button data-action="download-pdf"></button>
        <button data-action="show-more"></button>
      </div>
    `);

    document.documentElement.dataset.theme = "dark";
    initDownloadPdfButtons();
    initDownloadPdfButtons();

    const btnMissing = root.querySelector<HTMLButtonElement>("#btn-missing");
    const btnValid = root.querySelector<HTMLButtonElement>("#btn-valid");
    const btnNeg = root.querySelector<HTMLButtonElement>("#btn-neg");
    const btnNan = root.querySelector<HTMLButtonElement>("#btn-nan");

    btnMissing?.click();
    expect(alertMock).toHaveBeenCalledWith("Target element not found");

    btnValid?.click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    expect(saveMock).toHaveBeenCalledWith("calendario-2026.pdf");
    expect(document.documentElement.dataset.theme).toBe("dark");

    delete document.documentElement.dataset.theme;
    btnNeg?.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(saveMock).toHaveBeenCalledWith("document.pdf");

    vi.mocked(html2canvas).mockRejectedValueOnce(new Error("Canvas failed"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
      return;
    });
    btnNan?.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(errorSpy).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(
      "Failed to generate PDF. Please try again."
    );

    await close();
  });
});
