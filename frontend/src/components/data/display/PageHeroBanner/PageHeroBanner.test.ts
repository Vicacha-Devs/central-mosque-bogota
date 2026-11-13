import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import PageHeroBanner from "./PageHeroBanner.astro";

describe("PageHeroBanner", () => {
  it("should render hero banner when props are provided", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PageHeroBanner, {
      props: {
        badgeIcon: "mosque",
        badgeLabel: "Our Institution",
        title: "Central Mosque of Bogotá",
        subtitle: "A place of worship, learning, and community service.",
      },
    });

    expect(html).toContain("data-testid=\u0022page-hero-banner\u0022");
    expect(html).toContain("Our Institution");
    expect(html).toContain("Central Mosque of Bogotá");
    expect(html).toContain(
      "A place of worship, learning, and community service."
    );
  });

  it("should render slot content when slot is provided", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PageHeroBanner, {
      props: {
        badgeIcon: "menu_book",
        badgeLabel: "Islam & Faith",
        title: "Discover Islam",
        subtitle: "Learn about the pillars of faith.",
      },
      slots: {
        default: "<div data-testid=\u0022hero-slot\u0022>Shahada Callout</div>",
      },
    });

    expect(html).toContain("data-testid=\u0022hero-slot\u0022");
    expect(html).toContain("Shahada Callout");
  });
});
