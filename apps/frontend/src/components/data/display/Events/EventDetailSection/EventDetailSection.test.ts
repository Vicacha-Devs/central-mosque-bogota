import { getByRole, getByText } from "@testing-library/dom";
import { getDetailedEvents } from "@utils/localized-mocks";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import EventDetailSection from "./EventDetailSection.astro";

describe("EventDetailSection", () => {
  it("should render event detail when event is provided", async () => {
    const events = getDetailedEvents("en");
    const [eventItem, ...relatedEvents] = events;

    const { root, close } = await renderAstroComponentToDom(
      EventDetailSection,
      {
        props: {
          lang: "en",
          eventItem,
          relatedEvents,
        },
      }
    );

    try {
      expect(
        getByRole(root, "heading", {
          level: 1,
          name: eventItem.title,
        })
      ).toBeInTheDocument();
      expect(getByText(root, eventItem.speaker)).toBeInTheDocument();
      expect(getByText(root, eventItem.audience)).toBeInTheDocument();
      expect(getByText(root, relatedEvents[0].title)).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
