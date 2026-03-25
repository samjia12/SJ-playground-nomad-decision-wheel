import { CATEGORY_META } from "../data/outcomes.js";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(value, query) {
  const safeValue = escapeHtml(value);
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return safeValue;

  const matcher = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "ig");
  return safeValue.replace(matcher, '<mark class="browser-highlight">$1</mark>');
}

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

function renderBrowserActiveState({ query, activeCategory, totalCount, visibleCount }) {
  const categoryLabel =
    activeCategory === "all"
      ? "all categories"
      : CATEGORY_META[activeCategory]?.name ?? activeCategory;

  if (query) {
    return `Showing ${visibleCount} matches from ${totalCount} outcomes for “${query}” inside ${categoryLabel}.`;
  }

  if (activeCategory === "all") {
    return `Showing ${visibleCount} outcomes across the full archive. Use search or category filters to narrow the theater.`;
  }

  return `Showing ${visibleCount} outcomes inside ${categoryLabel}. The rest of the archive is still alive, just offstage.`;
}

export function renderOutcomeBrowser(
  elements,
  { outcomes, query, activeCategory, totalCount }
) {
  elements.browserCount.textContent = `${outcomes.length} of ${totalCount}`;
  elements.browserActiveState.textContent = renderBrowserActiveState({
    query,
    activeCategory,
    totalCount,
    visibleCount: outcomes.length,
  });

  elements.browserFilterLegend.innerHTML = `
    <button
      type="button"
      class="control-pill"
      data-browser-filter="all"
      aria-pressed="${activeCategory === "all"}"
    >
      All Categories
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
    elements.browserEmpty.innerHTML = query
      ? `
        <p>No outcomes matched “${escapeHtml(query)}”. The archive remains dramatic, just not under that wording.</p>
        <div class="browser-empty-actions">
          <button type="button" class="ghost-button" data-browser-clear-query>Clear Search</button>
          <button type="button" class="control-pill" data-browser-reset-view>Show Full Archive</button>
        </div>
      `
      : `
        <p>This browser view is currently too specific to be useful. Reset the browser filters and let the archive breathe again.</p>
        <div class="browser-empty-actions">
          <button type="button" class="control-pill" data-browser-reset-view>Show Full Archive</button>
        </div>
      `;
    elements.browserResults.innerHTML = "";
    return;
  }

  elements.browserEmpty.classList.add("hidden");
  elements.browserEmpty.innerHTML = "";
  elements.browserResults.innerHTML = outcomes
    .map((outcome) => {
      const category = CATEGORY_META[outcome.category];
      return `
        <article class="browser-card">
          <div class="browser-card-header">
            <div class="browser-card-meta">
              <span class="status-pill dialog-pill" style="color:${category.color}; box-shadow: 0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 999px rgba(255,255,255,0.02), 0 0 20px ${category.glow};">
                ${category.name}
              </span>
              <span class="browser-wheel-label">${highlightText(outcome.wheelLabel, query)}</span>
            </div>
            <span class="browser-outcome-id">#${String(outcome.id).padStart(3, "0")}</span>
          </div>
          <h3>${highlightText(outcome.title, query)}</h3>
          <p>${highlightText(outcome.detail, query)}</p>
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
