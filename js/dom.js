import {
  ACCURACY_LEVELS,
  CATEGORY_META,
  MODE_PRESETS,
} from "../data/outcomes.js";
import { CUSTOM_MODE_KEY } from "./state.js";

export function getElements() {
  return {
    modeControls: document.querySelector("#mode-preset-controls"),
    modeDescription: document.querySelector("#mode-description"),
    outcomeLibraryCount: document.querySelector("#outcome-library-count"),
    eligibleOutcomeCount: document.querySelector("#eligible-outcome-count"),
    activeDeckCount: document.querySelector("#active-deck-count"),
    outcomeStatusCaption: document.querySelector("#outcome-status-caption"),
    browseButtons: [...document.querySelectorAll("[data-open-browser]")],
    accuracyControls: document.querySelector("#accuracy-controls"),
    accuracyDescription: document.querySelector("#accuracy-description"),
    wheelSegments: document.querySelector("#wheel-segments"),
    wheelShell: document.querySelector("#wheel-shell"),
    wheelStatus: document.querySelector("#wheel-status"),
    wheelDeckBadge: document.querySelector("#wheel-deck-badge"),
    wheelDeckMeta: document.querySelector("#wheel-deck-meta"),
    pointerHit: document.querySelector("#pointer-hit"),
    spinButton: document.querySelector("#spin-button"),
    teaser: document.querySelector("#inline-teaser"),
    teaserLead: document.querySelector("#teaser-lead"),
    teaserCategory: document.querySelector("#teaser-category"),
    teaserLabel: document.querySelector("#teaser-label"),
    teaserCopy: document.querySelector("#teaser-copy"),
    teaserOpenButton: document.querySelector("#teaser-open"),
    teaserShareButton: document.querySelector("#teaser-share"),
    teaserFeedback: document.querySelector("#teaser-feedback"),
    restoreFiltersButton: document.querySelector("#restore-filters"),
    categoryLegend: document.querySelector("#category-legend"),
    historyList: document.querySelector("#history-list"),
    clearHistoryButton: document.querySelector("#clear-history"),
    detailModeName: document.querySelector("#detail-mode-name"),
    detailModeDescription: document.querySelector("#detail-mode-description"),
    detailCategorySummary: document.querySelector("#detail-category-summary"),
    detailAccuracySummary: document.querySelector("#detail-accuracy-summary"),
    detailPoolCount: document.querySelector("#detail-pool-count"),
    detailDeckSummary: document.querySelector("#detail-deck-summary"),
    projectShareButtons: [...document.querySelectorAll("[data-project-share]")],
    projectShareFeedback: document.querySelector("#project-share-feedback"),
    socialSnippets: document.querySelector("#social-snippets"),
    modal: document.querySelector("#result-modal"),
    modalPanel: document.querySelector("#modal-panel"),
    closeModal: document.querySelector("#close-modal"),
    modalTitle: document.querySelector("#modal-title"),
    modalCategory: document.querySelector("#modal-category"),
    modalTime: document.querySelector("#modal-time"),
    modalLead: document.querySelector("#modal-lead"),
    modalInterpretation: document.querySelector("#modal-interpretation"),
    modalShareButton: document.querySelector("#modal-share"),
    modalCopyLinkButton: document.querySelector("#modal-copy-link"),
    modalSpinAgainButton: document.querySelector("#modal-spin-again"),
    modalShareFeedback: document.querySelector("#modal-share-feedback"),
    browserModal: document.querySelector("#browser-modal"),
    browserPanel: document.querySelector("#browser-panel"),
    closeBrowser: document.querySelector("#close-browser"),
    browserSearch: document.querySelector("#browser-search"),
    browserFilterLegend: document.querySelector("#browser-filter-legend"),
    browserCount: document.querySelector("#browser-count"),
    browserResults: document.querySelector("#browser-results"),
    browserEmpty: document.querySelector("#browser-empty"),
  };
}

export function setWheelStatus(elements, message, tone = "neutral") {
  const toneColors = {
    neutral: "#D6C2A1",
    active: "#14F195",
    warning: "#FF8A65",
  };

  elements.wheelStatus.textContent = message;
  elements.wheelStatus.style.color = toneColors[tone] ?? toneColors.neutral;
}

export function setSpinState(elements, { disabled, label }) {
  elements.spinButton.disabled = disabled;
  elements.spinButton.textContent = label;
  elements.spinButton.classList.toggle("is-spinning", disabled);
}

export function flashPointer(elements) {
  elements.pointerHit.dataset.active = "true";
  window.setTimeout(() => {
    elements.pointerHit.dataset.active = "false";
  }, 560);
}

export function renderModeControls(elements, { activeModeKey, modeSummary }) {
  elements.modeControls.innerHTML = MODE_PRESETS.map((preset) => `
    <button
      type="button"
      class="control-pill rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.18em]"
      data-mode-key="${preset.key}"
      aria-pressed="${activeModeKey === preset.key}"
    >
      ${preset.name}
    </button>
  `).join("");

  if (activeModeKey === CUSTOM_MODE_KEY) {
    elements.modeDescription.textContent =
      `Manual Drift active. Canon lanes: ${modeSummary.mappingLabel}.`;
    return;
  }

  elements.modeDescription.textContent = `${modeSummary.description} Canon lanes: ${modeSummary.mappingLabel}.`;
}

export function renderAccuracyControls(elements, activeAccuracyKey) {
  elements.accuracyControls.innerHTML = ACCURACY_LEVELS.map((level) => `
    <button
      type="button"
      class="control-pill rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.18em]"
      data-accuracy-key="${level.key}"
      aria-pressed="${activeAccuracyKey === level.key}"
    >
      ${level.name}
    </button>
  `).join("");

  const activeAccuracy =
    ACCURACY_LEVELS.find((level) => level.key === activeAccuracyKey) ?? ACCURACY_LEVELS[1];
  elements.accuracyDescription.textContent = `${activeAccuracy.statusLabel}. ${activeAccuracy.description}`;
}

export function renderOutcomeCount(
  elements,
  { libraryCount, eligibleCount, activeDeckCount }
) {
  elements.outcomeLibraryCount.textContent = String(libraryCount);
  elements.eligibleOutcomeCount.textContent = String(eligibleCount);
  elements.activeDeckCount.textContent = String(activeDeckCount);
  elements.outcomeStatusCaption.textContent =
    "Library is the archive. Active deck is what the wheel is currently spinning.";
}

export function renderCategoryLegend(
  elements,
  { categoryCounts, activeCategories }
) {
  elements.categoryLegend.innerHTML = Object.values(CATEGORY_META)
    .map((category) => {
      const isActive = activeCategories.has(category.key);
      return `
        <article class="filter-card rounded-[24px] p-4" data-active="${isActive}">
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-start gap-3">
              <span class="mt-1 h-3 w-3 rounded-full" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-white">${category.name}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">${categoryCounts[category.key]} in library</p>
              </div>
            </div>
            <span class="filter-state text-[11px] uppercase tracking-[0.18em] ${isActive ? "text-accent-sand" : "text-slate-400"}">
              ${isActive ? "Live" : "Muted"}
            </span>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="control-pill rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em]"
              data-category-toggle="${category.key}"
              aria-pressed="${isActive}"
            >
              ${isActive ? "Included" : "Muted"}
            </button>
            <button
              type="button"
              class="ghost-button rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white"
              data-category-only="${category.key}"
            >
              Only
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

export function renderHistory(elements, historyEntries, { highlightId = null } = {}) {
  if (!historyEntries.length) {
    elements.historyList.innerHTML = `
      <div class="history-empty rounded-[22px] px-4 py-5 text-sm leading-6 text-slate-300">
        No spins yet. The wheel is respectfully waiting to ruin your certainty.
      </div>
    `;
    return;
  }

  elements.historyList.innerHTML = historyEntries
    .map((entry) => {
      const category = CATEGORY_META[entry.category];
      const title = entry.title ?? entry.label;
      return `
        <button
          type="button"
          class="history-item ${entry.id === highlightId ? "is-new" : ""} rounded-[22px] px-4 py-4 text-left"
          data-history-id="${entry.id}"
          aria-label="Reopen ${title} from ${entry.displayTime}"
          title="${title}"
        >
          <div class="flex items-start gap-3">
            <span class="mt-1.5 h-2.5 w-2.5 flex-none rounded-full" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <p class="history-title text-sm font-semibold leading-6 text-white">${title}</p>
                <time class="history-time flex-none text-xs text-slate-400" datetime="${entry.isoTime}">${entry.displayTime}</time>
              </div>
              <p class="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-300">${category.name}</p>
            </div>
          </div>
        </button>
      `;
    })
    .join("");
}

export function renderTeaser(elements, { outcome, accuracy, displayTime }) {
  const category = CATEGORY_META[outcome.category];
  elements.teaser.classList.remove("hidden");
  elements.teaserLead.textContent = accuracy.teaserLead;
  elements.teaserCategory.textContent = `${category.name} • ${displayTime}`;
  elements.teaserCategory.style.color = category.color;
  elements.teaserLabel.textContent = outcome.title;
  elements.teaserCopy.textContent = outcome.detail;
  elements.teaserFeedback.textContent = "";
}

export function hideTeaser(elements) {
  elements.teaser.classList.add("hidden");
  elements.teaserFeedback.textContent = "";
}

export function setTeaserFeedback(elements, message) {
  elements.teaserFeedback.textContent = message;
}

export function setProjectShareFeedback(elements, message) {
  elements.projectShareFeedback.textContent = message;
}

export function renderDetailDeck(
  elements,
  { modeSummary, activeCategories, accuracy, libraryCount, eligibleCount, activeDeckCount }
) {
  elements.detailModeName.textContent = modeSummary.name;
  elements.detailModeDescription.textContent = modeSummary.description;
  elements.detailCategorySummary.textContent =
    activeCategories.length
      ? activeCategories.map((categoryKey) => CATEGORY_META[categoryKey].name).join(" • ")
      : "No active categories. The wheel is currently fasting.";
  elements.detailAccuracySummary.textContent = `${accuracy.shortLabel} • ${accuracy.statusLabel}`;
  elements.detailPoolCount.textContent = `${libraryCount} library • ${eligibleCount} eligible`;
  elements.detailDeckSummary.textContent = `${activeDeckCount} active segments currently loaded onto the wheel.`;
}

export function renderWheelMeta(elements, { libraryCount, eligibleCount, activeDeckCount }) {
  elements.wheelDeckBadge.textContent = `${activeDeckCount} active segments`;
  elements.wheelDeckMeta.textContent = `${eligibleCount} eligible from ${libraryCount} in the archive`;
}

export function renderSocialSnippets(elements, outcomes) {
  const selections = [outcomes[5], outcomes[28], outcomes[96]].filter(Boolean);
  elements.socialSnippets.innerHTML = selections
    .map((outcome) => {
      const category = CATEGORY_META[outcome.category];
      return `
        <article class="social-card rounded-[28px] p-5">
          <div class="flex items-center gap-3">
            <span class="h-3 w-3 rounded-full" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
            <span class="text-[11px] uppercase tracking-[0.22em] text-slate-400">${category.name}</span>
          </div>
          <p class="mt-4 text-lg font-semibold leading-7 text-white">"${outcome.title}"</p>
          <p class="mt-4 font-mono text-sm leading-7 text-slate-200">${outcome.shareText}</p>
        </article>
      `;
    })
    .join("");
}

export function renderOutcomeBrowser(
  elements,
  { outcomes, query, activeCategory, totalCount }
) {
  elements.browserCount.textContent = `${outcomes.length} of ${totalCount} visible`;

  elements.browserFilterLegend.innerHTML = `
    <button
      type="button"
      class="control-pill rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em]"
      data-browser-filter="all"
      aria-pressed="${activeCategory === "all"}"
    >
      All
    </button>
    ${Object.values(CATEGORY_META)
      .map((category) => `
        <button
          type="button"
          class="control-pill rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em]"
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
        <article class="browser-card rounded-[24px] p-4">
          <div class="flex flex-wrap items-center gap-3">
            <span class="status-pill rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.18em]" style="color:${category.color}; box-shadow: 0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 999px rgba(255,255,255,0.02), 0 0 20px ${category.glow};">
              ${category.name}
            </span>
            <span class="browser-wheel-label text-[11px] uppercase tracking-[0.18em] text-slate-300">${outcome.wheelLabel}</span>
          </div>
          <h3 class="mt-4 text-lg font-semibold leading-7 text-white">${outcome.title}</h3>
          <p class="mt-3 font-mono text-sm leading-7 text-slate-200">${outcome.detail}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="ghost-button rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
              data-browser-show-category="${category.key}"
            >
              Show Category
            </button>
            <button
              type="button"
              class="control-pill rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
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
