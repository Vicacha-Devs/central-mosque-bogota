const ACTIVE_CLASSES = [
  "border-transparent",
  "bg-secondary",
  "font-bold",
  "text-secondary-foreground",
  "shadow-sm",
];

const INACTIVE_CLASSES = [
  "border-border",
  "bg-card",
  "font-semibold",
  "text-foreground",
  "hover:bg-muted",
];

type TSerializedEvent = {
  title: string;
  category: string;
  schedule: string;
  location: string;
  url: string;
  day: number;
  month: string;
};

const VIEW_ACTIVE_CLASSES = [
  "bg-secondary",
  "font-bold",
  "text-secondary-foreground",
  "shadow-xs",
];

const VIEW_INACTIVE_CLASSES = [
  "font-semibold",
  "text-muted-foreground",
  "hover:text-foreground",
];

function getWeekdayLabels(lang: string): Array<string> {
  const fmt = new Intl.DateTimeFormat(lang, { weekday: "short" });
  // 2024-01-01 is a Monday
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(2024, 0, 1 + i)));
}

function renderCalendar(
  root: HTMLElement,
  events: Array<TSerializedEvent>,
  selectedCategory: string,
  viewDate: Date,
  selectedDay: number | null,
  onSelectDay: (day: number) => void
): void {
  const lang = root.dataset.lang ?? "es";
  const noEventsLabel = root.dataset.noEventsLabel ?? "No events scheduled.";
  const monthLabelEl = root.querySelector<HTMLElement>(
    "[data-cal-month-label]"
  );
  const weekdaysDesktop = root.querySelector<HTMLElement>(
    "[data-cal-weekdays-desktop]"
  );
  const gridDesktop = root.querySelector<HTMLElement>(
    "[data-cal-grid-desktop]"
  );
  const weekdaysMobile = root.querySelector<HTMLElement>(
    "[data-cal-weekdays-mobile]"
  );
  const gridMobile = root.querySelector<HTMLElement>("[data-cal-grid-mobile]");
  const mobileAgenda = root.querySelector<HTMLElement>(
    "[data-cal-mobile-agenda]"
  );

  if (!monthLabelEl || !gridDesktop || !gridMobile || !mobileAgenda) return;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  monthLabelEl.textContent = new Intl.DateTimeFormat(lang, {
    month: "long",
    year: "numeric",
  }).format(viewDate);

  const weekdays = getWeekdayLabels(lang);
  if (weekdaysDesktop?.childElementCount === 0) {
    weekdays.forEach((wd) => {
      const cell = document.createElement("div");
      cell.className = "py-2.5";
      cell.textContent = wd;
      weekdaysDesktop.appendChild(cell);
    });
  }
  if (weekdaysMobile?.childElementCount === 0) {
    weekdays.forEach((wd) => {
      const cell = document.createElement("div");
      cell.textContent = wd;
      weekdaysMobile.appendChild(cell);
    });
  }

  const filteredEvents = events.filter(
    (ev) => selectedCategory === "all" || ev.category === selectedCategory
  );
  const eventsByDay = new Map<number, Array<TSerializedEvent>>();
  filteredEvents.forEach((ev) => {
    const day = ev.day;
    if (!Number.isFinite(day) || day < 1 || day > 31) return;
    const list = eventsByDay.get(day) ?? [];
    list.push(ev);
    eventsByDay.set(day, list);
  });

  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  gridDesktop.replaceChildren();
  gridMobile.replaceChildren();

  for (let i = 0; i < firstDow; i++) {
    const blankDesktop = document.createElement("div");
    blankDesktop.className
      = "min-h-24 border-e border-b border-border bg-muted/30";
    gridDesktop.appendChild(blankDesktop);

    const blankMobile = document.createElement("div");
    gridMobile.appendChild(blankMobile);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = eventsByDay.get(day) ?? [];
    const hasEvents = dayEvents.length > 0;

    // Desktop cell
    const cell = document.createElement("div");
    cell.className = `min-h-24 border-e border-b border-border p-2 text-start ${
      hasEvents ? "bg-primary/5" : ""
    }`;

    const dayNum = document.createElement("span");
    dayNum.className = `inline-flex size-6 items-center justify-center rounded-full text-xs font-bold ${
      hasEvents ? "bg-primary text-primary-foreground" : "text-foreground"
    }`;
    dayNum.textContent = String(day);
    cell.appendChild(dayNum);

    dayEvents.slice(0, 2).forEach((ev, idx) => {
      const pill = document.createElement("a");
      pill.href = ev.url || "#";
      pill.className = `mt-1 block truncate rounded px-1.5 py-0.5 text-[11px] font-semibold transition-opacity hover:opacity-90 ${
        idx % 2 === 0
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground"
      }`;
      pill.textContent = ev.title;
      pill.title = `${ev.title} (${ev.schedule})`;
      cell.appendChild(pill);
    });
    gridDesktop.appendChild(cell);

    // Mobile dot cell
    const mBtn = document.createElement("button");
    mBtn.type = "button";
    const isSelected = selectedDay === day;
    mBtn.className = `mx-auto flex size-9 flex-col items-center justify-center rounded-full text-xs font-bold transition-colors ${
      isSelected
        ? "bg-primary text-primary-foreground"
        : hasEvents
          ? "bg-secondary/10 text-secondary dark:text-secondary-accent"
          : "text-foreground hover:bg-muted"
    }`;
    mBtn.setAttribute(
      "aria-label",
      `${String(day)} (${String(dayEvents.length)})`
    );
    const mNum = document.createElement("span");
    mNum.textContent = String(day);
    mBtn.appendChild(mNum);

    if (hasEvents) {
      const dot = document.createElement("span");
      dot.className = `mt-0.5 size-1 rounded-full ${
        isSelected ? "bg-primary-foreground" : "bg-primary"
      }`;
      mBtn.appendChild(dot);
    }
    mBtn.addEventListener("click", () => {
      onSelectDay(day);
    });
    gridMobile.appendChild(mBtn);
  }

  // Mobile agenda list
  mobileAgenda.replaceChildren();
  const agendaEvents
    = selectedDay !== null
      ? (eventsByDay.get(selectedDay) ?? [])
      : filteredEvents;

  if (agendaEvents.length === 0) {
    const empty = document.createElement("p");
    empty.className
      = "rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground";
    empty.textContent = noEventsLabel;
    mobileAgenda.appendChild(empty);
    return;
  }

  agendaEvents.forEach((ev) => {
    const item = document.createElement("a");
    item.href = ev.url || "#";
    item.className
      = "flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-start transition-colors hover:bg-muted/50";

    const info = document.createElement("div");
    info.className = "min-w-0";
    const title = document.createElement("p");
    title.className = "truncate text-sm font-bold text-foreground";
    title.textContent = ev.title;
    const meta = document.createElement("p");
    meta.className = "text-xs text-muted-foreground";
    meta.textContent = `${String(ev.day)} • ${ev.schedule}`;
    info.append(title, meta);

    const badge = document.createElement("span");
    badge.className
      = "shrink-0 rounded-full bg-secondary/10 px-2.5 py-0.5 text-[11px] font-bold text-secondary dark:text-secondary-accent";
    badge.textContent = ev.category;

    item.append(info, badge);
    mobileAgenda.appendChild(item);
  });
}

/**
 * Initializes the client-side category filter buttons (`[data-event-filter]`)
 * and `Lista | Calendario` view switcher for the Events Catalog section.
 */
export function initEventFilters(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    "[data-event-filter]"
  );
  const cards = document.querySelectorAll<HTMLElement>("[data-event-category]");
  const catalogRoot = document.querySelector<HTMLElement>(
    "[data-events-catalog]"
  );
  const listGrid = document.getElementById("events-grid");
  const calendarPanel = document.querySelector<HTMLElement>(
    "[data-events-calendar-panel]"
  );
  const viewTabs = document.querySelectorAll<HTMLButtonElement>(
    "[data-events-view-tab]"
  );

  let selectedCategory = "all";
  let currentDate = new Date();
  let selectedDay: number | null = null;
  let parsedEvents: Array<TSerializedEvent> = [];

  if (catalogRoot?.dataset.eventsJson) {
    try {
      parsedEvents = JSON.parse(
        catalogRoot.dataset.eventsJson
      ) as Array<TSerializedEvent>;
    } catch {
      parsedEvents = [];
    }
  }

  const syncCalendar = (): void => {
    if (
      !catalogRoot
      || !calendarPanel
      || calendarPanel.classList.contains("hidden")
    ) {
      return;
    }
    renderCalendar(
      catalogRoot,
      parsedEvents,
      selectedCategory,
      currentDate,
      selectedDay,
      (day) => {
        selectedDay = selectedDay === day ? null : day;
        syncCalendar();
      }
    );
  };

  buttons.forEach((btn) => {
    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      selectedCategory = btn.getAttribute("data-event-filter") ?? "all";
      selectedDay = null;

      buttons.forEach((b) => {
        const isActive = b === btn;
        b.setAttribute("aria-selected", String(isActive));
        for (const cls of ACTIVE_CLASSES) {
          b.classList.toggle(cls, isActive);
        }
        for (const cls of INACTIVE_CLASSES) {
          b.classList.toggle(cls, !isActive);
        }
      });

      cards.forEach((card) => {
        const cat = card.getAttribute("data-event-category");
        const show = selectedCategory === "all" || cat === selectedCategory;
        card.classList.toggle("hidden", !show);
      });

      syncCalendar();
    });
  });

  viewTabs.forEach((tab) => {
    if (tab.dataset.bound === "true") return;
    tab.dataset.bound = "true";

    tab.addEventListener("click", () => {
      const targetView = tab.dataset.eventsViewTab ?? "list";
      const isCalendar = targetView === "calendar";

      viewTabs.forEach((t) => {
        const active = t === tab;
        t.setAttribute("aria-selected", String(active));
        for (const cls of VIEW_ACTIVE_CLASSES) {
          t.classList.toggle(cls, active);
        }
        for (const cls of VIEW_INACTIVE_CLASSES) {
          t.classList.toggle(cls, !active);
        }
      });

      listGrid?.classList.toggle("hidden", isCalendar);
      calendarPanel?.classList.toggle("hidden", !isCalendar);
      if (isCalendar) syncCalendar();
    });
  });

  const prevBtn
    = catalogRoot?.querySelector<HTMLButtonElement>("[data-cal-prev]");
  const nextBtn
    = catalogRoot?.querySelector<HTMLButtonElement>("[data-cal-next]");
  if (prevBtn && prevBtn.dataset.bound !== "true") {
    prevBtn.dataset.bound = "true";
    prevBtn.addEventListener("click", () => {
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      selectedDay = null;
      syncCalendar();
    });
  }
  if (nextBtn && nextBtn.dataset.bound !== "true") {
    nextBtn.dataset.bound = "true";
    nextBtn.addEventListener("click", () => {
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
      selectedDay = null;
      syncCalendar();
    });
  }
}
