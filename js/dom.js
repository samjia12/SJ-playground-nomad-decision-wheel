import {
  ACCURACY_LEVELS,
  CATEGORY_META,
  MODE_PRESETS,
} from "../data/outcomes.js";
import { CUSTOM_MODE_KEY } from "./state.js";

const modeNameLookup = new Map(MODE_PRESETS.map((preset) => [preset.key, preset.name]));
const accuracyNameLookup = new Map(ACCURACY_LEVELS.map((level) => [level.key, level.name]));
modeNameLookup.set(CUSTOM_MODE_KEY, "Manual Drift");

export function getElements() {
  return {
    modeControls: document.querySelector("#mode-preset-controls"),
    modeDescription: document.querySelector("#mode-description"),
    outcomeLibraryCount: document.querySelector("#outcome-library-count"),
    eligibleOutcomeCount: document.querySelector("#eligible-outcome-count"),
    activeDeckCount: document.querySelector("#active-deck-count"),
    outcomeStatusCaption: document.querySelector("#outcome-status-caption"),
    outcomeStateNote: document.querySelector("#outcome-state-note"),
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
    teaserSpinButton: document.querySelector("#teaser-spin"),
    teaserOpenButton: document.querySelector("#teaser-open"),
    teaserShareButton: document.querySelector("#teaser-share"),
    teaserCopyButton: document.querySelector("#teaser-copy-link"),
    teaserFeedback: document.querySelector("#teaser-feedback"),
    restoreFiltersButton: document.querySelector("#restore-filters"),
    categoryLegend: document.querySelector("#category-legend"),
    historyPanel: document.querySelector("#history-panel"),
    historyList: document.querySelector("#history-list"),
    historyToggleButton: document.querySelector("#history-toggle"),
    clearHistoryButton: document.querySelector("#clear-history"),
    detailModeName: document.querySelector("#detail-mode-name"),
    detailModeDescription: document.querySelector("#detail-mode-description"),
    detailCategorySummary: document.querySelector("#detail-category-summary"),
    detailAccuracySummary: document.querySelector("#detail-accuracy-summary"),
    detailPoolCount: document.querySelector("#detail-pool-count"),
    detailDeckSummary: document.querySelector("#detail-deck-summary"),
    detailDeckSeed: document.querySelector("#detail-deck-seed"),
    detailActivePreview: document.querySelector("#detail-active-preview"),
    detailActiveList: document.querySelector("#detail-active-list"),
    projectShareButtons: [...document.querySelectorAll("[data-project-share]")],
    projectShareFeedback: document.querySelector("#project-share-feedback"),
    projectShareUrl: document.querySelector("#project-share-url"),
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
    browserActiveState: document.querySelector("#browser-active-state"),
    browserCount: document.querySelector("#browser-count"),
    browserResults: document.querySelector("#browser-results"),
    browserEmpty: document.querySelector("#browser-empty"),
  };
}

export function setWheelStatus(elements, message, tone = "neutral") {
  const toneColors = {
    neutral: "#F4D07A",
    active: "#C4B5FD",
    warning: "#FB8B8B",
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
      `Manual Drift active. Maps to ${modeSummary.mappingLabel}.`;
    return;
  }

  elements.modeDescription.textContent = `${modeSummary.description} Maps to ${modeSummary.mappingLabel}.`;
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
  { libraryCount, eligibleCount, activeDeckCount, activeCategoryCount }
) {
  elements.outcomeLibraryCount.textContent = String(libraryCount);
  elements.eligibleOutcomeCount.textContent = String(eligibleCount);
  elements.activeDeckCount.textContent = String(activeDeckCount);
  elements.outcomeStatusCaption.textContent =
    "Library is the full archive. Eligible is the pool that survived your current ritual. Active deck is what the wheel is visibly spinning.";

  if (activeCategoryCount === 0) {
    elements.outcomeStateNote.textContent =
      "You muted every category. Use Restore All to put the ritual back on speaking terms with itself.";
    elements.restoreFiltersButton.classList.add("is-urgent");
    return;
  }

  elements.restoreFiltersButton.classList.remove("is-urgent");

  if (eligibleCount === 1) {
    elements.outcomeStateNote.textContent =
      "Single-outcome mode is active. Repeats are expected because the wheel currently has no alternate personality.";
    return;
  }

  if (eligibleCount > activeDeckCount) {
    elements.outcomeStateNote.textContent =
      "The archive is larger than the stage, so the deck seed decides which outcomes get screen time for this spin.";
    return;
  }

  elements.outcomeStateNote.textContent =
    "All eligible outcomes are currently on stage. The wheel is not hiding any extra lore right now.";
}

export function renderCategoryLegend(
  elements,
  { categoryCounts, activeCategories }
) {
  elements.categoryLegend.innerHTML = Object.values(CATEGORY_META)
    .map((category) => {
      const isActive = activeCategories.has(category.key);
      return `
        <div class="category-filter" data-active="${isActive}">
          <button
            type="button"
            class="filter-chip"
            data-category-toggle="${category.key}"
            aria-pressed="${isActive}"
            aria-label="${isActive ? "Mute" : "Include"} ${category.name}"
          >
            <span class="filter-dot" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
            <span class="filter-label">${category.name}</span>
            <span class="filter-count">${categoryCounts[category.key]}</span>
            <span class="filter-state">${isActive ? "Included" : "Muted"}</span>
          </button>
          <button
            type="button"
            class="filter-mini"
            data-category-only="${category.key}"
            aria-label="Only ${category.name}"
          >
            Only
          </button>
        </div>
      `;
    })
    .join("");
}

export function renderHistory(
  elements,
  historyEntries,
  { highlightId = null, expanded = false, previewCount = 5 } = {}
) {
  const visibleEntries = expanded ? historyEntries : historyEntries.slice(0, previewCount);

  if (elements.historyPanel) {
    elements.historyPanel.dataset.expanded = String(expanded);
  }

  if (elements.historyToggleButton) {
    const needsToggle = historyEntries.length > previewCount;
    elements.historyToggleButton.hidden = !needsToggle;
    elements.historyToggleButton.textContent = expanded
      ? "Show Less"
      : `View All ${historyEntries.length}`;
    elements.historyToggleButton.setAttribute("aria-expanded", String(expanded));
  }

  if (!historyEntries.length) {
    elements.historyList.innerHTML = `
      <div class="history-empty">
        No spins yet. The wheel is respectfully waiting to ruin your certainty.
      </div>
    `;
    return;
  }

  elements.historyList.innerHTML = visibleEntries
    .map((entry) => {
      const category = CATEGORY_META[entry.category];
      const title = entry.title ?? entry.label;
      const modeName = modeNameLookup.get(entry.modeKey) ?? "All Fates";
      const accuracyName = accuracyNameLookup.get(entry.accuracyKey) ?? "Ritual Grade";
      return `
        <button
          type="button"
          class="history-item ${entry.id === highlightId ? "is-new" : ""}"
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
              <div class="history-meta-row">
                <span class="history-meta-pill">${category.compactName}</span>
                <span class="history-meta-pill">${modeName}</span>
                <span class="history-meta-pill">${accuracyName}</span>
              </div>
            </div>
          </div>
        </button>
      `;
    })
    .join("");
}

export function renderTeaser(elements, { outcome, accuracy, displayTime }) {
  const category = CATEGORY_META[outcome.category];
  elements.teaser.dataset.state = "live";
  elements.teaserLead.textContent = accuracy.teaserLead;
  elements.teaserCategory.textContent = `${category.name} • ${displayTime}`;
  elements.teaserCategory.style.color = category.color;
  elements.teaserLabel.textContent = outcome.title;
  elements.teaserCopy.textContent = outcome.detail;
  elements.teaserFeedback.textContent = "";
  elements.teaserOpenButton.disabled = false;
  elements.teaserShareButton.disabled = false;
  elements.teaserCopyButton.disabled = false;
}

export function hideTeaser(elements) {
  elements.teaser.dataset.state = "empty";
  elements.teaserLead.textContent = "Current omen";
  elements.teaserCategory.textContent = "Awaiting spin";
  elements.teaserCategory.style.color = "";
  elements.teaserLabel.textContent = "Spin the wheel to extract a premium-quality bad idea.";
  elements.teaserCopy.textContent =
    "The archive is live, the pointer is judgmental, and the current deck is what this wheel can actually land on right now.";
  elements.teaserOpenButton.disabled = true;
  elements.teaserShareButton.disabled = true;
  elements.teaserCopyButton.disabled = true;
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
  {
    modeSummary,
    activeCategories,
    accuracy,
    libraryCount,
    eligibleCount,
    activeDeckCount,
    deckSeed,
    activeWheelPool,
  }
) {
  elements.detailModeName.textContent = modeSummary.name;
  elements.detailModeDescription.textContent = `Maps to ${modeSummary.mappingLabel}.`;
  elements.detailCategorySummary.textContent =
    activeCategories.length
      ? activeCategories.map((categoryKey) => CATEGORY_META[categoryKey].name).join(" • ")
      : "No active categories. The wheel is currently fasting.";
  elements.detailAccuracySummary.textContent = `${accuracy.shortLabel} • ${accuracy.statusLabel}`;
  elements.detailPoolCount.innerHTML = `
    <span class="deck-metric"><strong>${libraryCount}</strong><span>Library</span></span>
    <span class="deck-metric"><strong>${eligibleCount}</strong><span>Eligible</span></span>
    <span class="deck-metric"><strong>${activeDeckCount}</strong><span>Active deck</span></span>
  `;
  elements.detailDeckSummary.textContent =
    eligibleCount > activeDeckCount
      ? "Archive is everything. Eligible is your filtered pool. Active deck is the visible seeded slice currently allowed on stage."
      : "Archive is everything. Eligible and active deck currently match, so the wheel is showing the whole filtered pool.";
  elements.detailDeckSeed.textContent = deckSeed;
  elements.detailActivePreview.innerHTML = activeWheelPool
    .slice(0, 8)
    .map(
      (outcome) => `
        <span class="deck-chip deck-chip--preview">${String(
          outcome.wheelLabel ?? outcome.shortLabel ?? outcome.title
        ).toUpperCase()}</span>
      `
    )
    .join("");
  elements.detailActiveList.innerHTML = activeWheelPool
    .map(
      (outcome) => `
        <span class="deck-chip deck-chip--full">${String(outcome.id).padStart(2, "0")} · ${outcome.title}</span>
      `
    )
    .join("");
}

export function renderWheelMeta(elements, { libraryCount, eligibleCount, activeDeckCount }) {
  elements.wheelDeckBadge.textContent = `${activeDeckCount} visible segments`;
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
