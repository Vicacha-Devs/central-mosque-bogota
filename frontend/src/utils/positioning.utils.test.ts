import {
  getTransformOrigin,
  resolvePlacement,
  type ResolvePlacementOptions,
} from "@utils/positioning.utils";

function makeRect(rect: {
  top: number;
  left: number;
  width: number;
  height: number;
}): DOMRect {
  const { top, left, width, height } = rect;
  return {
    top,
    left,
    width,
    height,
    bottom: top + height,
    right: left + width,
    x: left,
    y: top,
    toJSON: (): Record<string, never> => ({}),
  };
}

const baseOptions: Omit<ResolvePlacementOptions, "triggerRect"> = {
  side: "bottom",
  align: "start",
  sideOffset: 4,
  contentWidth: 150,
  contentHeight: 100,
  viewportWidth: 1000,
  viewportHeight: 800,
  viewportPadding: 8,
  avoidCollisions: true,
};

describe("positioning.utils", () => {
  describe("resolvePlacement", () => {
    it("should anchor below the trigger when the preferred bottom/start placement fits", () => {
      const triggerRect = makeRect({
        top: 100,
        left: 100,
        width: 100,
        height: 20,
      });

      const result = resolvePlacement({ ...baseOptions, triggerRect });

      expect(result.side).toBe("bottom");
      expect(result.align).toBe("start");
      expect(result.top).toBe(124); // triggerRect.bottom (120) + sideOffset (4)
      expect(result.left).toBe(100); // aligned to triggerRect.left
    });

    it("should flip to the opposite side when the preferred side overflows", () => {
      const triggerRect = makeRect({
        top: 760,
        left: 100,
        width: 100,
        height: 20,
      });

      const result = resolvePlacement({ ...baseOptions, triggerRect });

      expect(result.side).toBe("top");
      // triggerRect.top (760) - contentHeight (100) - sideOffset (4)
      expect(result.top).toBe(656);
    });

    it("should return the preferred placement unchanged when collisions are ignored", () => {
      const triggerRect = makeRect({
        top: 760,
        left: 100,
        width: 100,
        height: 20,
      });

      const result = resolvePlacement({
        ...baseOptions,
        triggerRect,
        avoidCollisions: false,
      });

      expect(result.side).toBe("bottom");
      expect(result.top).toBe(784); // not clamped or flipped
    });
  });

  describe("getTransformOrigin", () => {
    it("should map to the nearest edge when the placement is vertical or horizontal", () => {
      expect(getTransformOrigin("bottom", "start")).toBe("left top");
      expect(getTransformOrigin("bottom", "center")).toBe("center top");
      expect(getTransformOrigin("top", "end")).toBe("right bottom");
      expect(getTransformOrigin("right", "center")).toBe("left center");
      expect(getTransformOrigin("right", "end")).toBe("left bottom");
      expect(getTransformOrigin("left", "start")).toBe("right top");
    });

    it("should evaluate left, right, top, center, and end candidates when resolving placement", () => {
      const triggerRect = makeRect({
        top: 100,
        left: 100,
        width: 100,
        height: 20,
      });

      expect(triggerRect.toJSON()).toEqual({});

      for (const side of ["top", "bottom", "left", "right"] as const) {
        for (const align of ["start", "center", "end"] as const) {
          const res = resolvePlacement({
            ...baseOptions,
            side,
            align,
            triggerRect,
          });
          expect(res.top).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });
});
