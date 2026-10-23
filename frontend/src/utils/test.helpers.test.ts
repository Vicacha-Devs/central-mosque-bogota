import { describe, expect, it, vi } from "vitest";

import {
  createTestDom,
  createUser,
  ensureDialogApi,
  ensureElementGetAnimations,
  installMatchMedia,
} from "./test.helpers";

describe("test.helpers", () => {
  it("should install DOM globals, requestAnimationFrame, and createUser when createTestDom is called", async () => {
    const { window, root, close } = createTestDom(
      "<div id=\u0022box\u0022><dialog id=\u0022dlg\u0022></dialog></div>"
    );

    const frameCb = vi.fn();
    const rafId = globalThis.requestAnimationFrame(frameCb);
    expect(rafId).toBe(0);
    expect(frameCb).toHaveBeenCalledWith(0);

    const user = await createUser(window);
    expect(user).toBeDefined();
    expect(root.querySelector("#box")).not.toBeNull();

    await close();
  });

  it("should patch matchMedia when existing matchMedia is present or missing", async () => {
    const { window, close } = createTestDom("<div></div>");

    installMatchMedia(window);
    expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(
      true
    );
    expect(window.matchMedia("(min-width: 768px)").media).toBe(
      "(min-width: 768px)"
    );

    const winWithoutMatchMedia = window as unknown as {
      matchMedia?: unknown;
    };
    winWithoutMatchMedia.matchMedia = undefined;
    installMatchMedia(window);

    const fallbackList = window.matchMedia("(min-width: 768px)");
    expect(fallbackList.matches).toBe(false);
    expect(fallbackList.dispatchEvent(new window.Event("change"))).toBe(false);

    await close();
  });

  it("should polyfill getAnimations and dialog methods when missing or present", async () => {
    const { root, close } = createTestDom(
      "<div id=\u0022box\u0022></div><dialog id=\u0022dlg\u0022></dialog>"
    );

    const box = root.querySelector<HTMLElement>("#box");
    const dlg = root.querySelector<HTMLDialogElement>("#dlg");
    expect(box).not.toBeNull();
    expect(dlg).not.toBeNull();
    if (!box || !dlg) return;

    ensureElementGetAnimations(box);
    ensureElementGetAnimations(box);
    const boxRecord = box as unknown as Record<string, unknown>;
    boxRecord.getAnimations = undefined;
    ensureElementGetAnimations(box);
    expect(box.getAnimations()).toEqual([]);

    ensureDialogApi(dlg);
    ensureDialogApi(dlg);
    const dlgRecord = dlg as unknown as Record<string, unknown>;
    dlgRecord.showModal = undefined;
    dlgRecord.show = undefined;
    dlgRecord.close = undefined;
    dlgRecord.getAnimations = undefined;

    ensureDialogApi(dlg);
    dlg.showModal();
    expect(dlg.hasAttribute("open")).toBe(true);
    dlg.close();
    expect(dlg.hasAttribute("open")).toBe(false);
    dlg.show();
    expect(dlg.hasAttribute("open")).toBe(true);
    expect(dlg.getAnimations()).toEqual([]);

    await close();
  });
});
