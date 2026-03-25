import { CATEGORY_META } from "../data/outcomes.js";

export function filterOutcomeLibrary(
  outcomes,
  { query = "", activeCategory = "all" } = {}
) {
  const normalizedQuery = query.trim().toLowerCase();

  return outcomes.filter((outcome) => {
    const matchesCategory =
      activeCategory === "all" || outcome.category === activeCategory;

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [
      outcome.wheelLabel,
      outcome.title,
      outcome.detail,
      outcome.categoryLabel,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
  });
}

export function renderOutcomeBrowser(
  elements,
  { outcomes, query, activeCategory, totalCount }
) {
  elements.browserCount.textContent = `${outcomes.length} of ${totalCount}`;

  elements.browserFilterLegend.innerHTML = `
        <button
          type="button"
          class="control-pill"
          data-browser-filter="all"
          aria-pressed="${activeCategory === "all"}"
        >
      All
    </button>
    ${Object.values(CATEGORY_META)
      .map((category) => `
        <button
          type="button"
          class="control-pill"
          data-browser-filter="${category.key}"
          aria-pressed="${activeCategory === category.key}"
        >
          ${category.name}
        </button>
      `)
      .join("")}
  `;

  if (!outcomes.length) {
    elements.browserEmpty.classList.remove("hidden");
    elements.browserEmpty.textContent = query
      ? "No outcomes matched that phrase. The archive remains dramatic, just not in that exact wording."
      : "No outcomes in this browser view yet.";
    elements.browserResults.innerHTML = "";
    return;
  }

  elements.browserEmpty.classList.add("hidden");
  elements.browserResults.innerHTML = outcomes
    .map((outcome) => {
      const category = CATEGORY_META[outcome.category];
      return `
        <article class="browser-card">
          <div class="flex flex-wrap items-center gap-3">
            <span class="status-pill dialog-pill" style="color:${category.color}; box-shadow: 0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 999px rgba(255,255,255,0.02), 0 0 20px ${category.glow};">
              ${category.name}
            </span>
            <span class="browser-wheel-label">${outcome.wheelLabel}</span>
          </div>
          <h3 class="mt-4 text-lg font-semibold leading-7 text-white">${outcome.title}</h3>
          <p class="mt-3 font-mono text-sm leading-7 text-slate-200">${outcome.detail}</p>
          <div class="browser-card-actions">
            <button
              type="button"
              class="ghost-button"
              data-browser-show-category="${category.key}"
            >
              Show Category
            </button>
            <button
              type="button"
              class="control-pill"
              data-browser-only-category="${category.key}"
            >
              Only This Category
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}
