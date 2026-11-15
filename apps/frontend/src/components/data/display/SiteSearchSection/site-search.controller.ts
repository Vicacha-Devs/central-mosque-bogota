/**
 * Initializes client-side keyword search and category filtering inside `SiteSearchSection`.
 */
export function initSiteSearch(root: ParentNode = document): void {
  const input = root.querySelector<HTMLInputElement>("#site-search-input");
  const filterButtons = root.querySelectorAll<HTMLButtonElement>(
    "[data-search-filter]"
  );
  const resultCards = root.querySelectorAll<HTMLElement>("[data-search-item]");
  const emptyState = root.querySelector<HTMLElement>("#site-search-empty");

  if (!input || !emptyState) return;
  if (input.getAttribute("data-search-bound") === "true") return;
  input.setAttribute("data-search-bound", "true");

  let activeCategory = "all";

  const applyFilters = () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    resultCards.forEach((card) => {
      const cat = card.getAttribute("data-search-category") ?? "";
      const text = card.getAttribute("data-search-text") ?? "";
      const matchesCat = activeCategory === "all" || cat === activeCategory;
      const matchesQuery = !query || text.includes(query);
      const visible = matchesCat && matchesQuery;

      card.classList.toggle("hidden", !visible);
      if (visible) visibleCount += 1;
    });

    emptyState.classList.toggle("hidden", visibleCount > 0);
  };

  input.addEventListener("input", applyFilters);

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.getAttribute("data-search-filter") ?? "all";

      filterButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("bg-secondary", isActive);
        b.classList.toggle("text-white", isActive);
        b.classList.toggle("bg-white", !isActive);
        b.classList.toggle("text-slate-700", !isActive);
      });

      applyFilters();
    });
  });
}
