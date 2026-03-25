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
    activeOutcomeCount: document.querySelector("#active-outcome-count"),
    activeOutcomeCaption: document.querySelector("#active-outcome-caption"),
    accuracyControls: document.querySelector("#accuracy-controls"),
    accuracyDescription: document.querySelector("#accuracy-description"),
    wheelSegments: document.querySelector("#wheel-segments"),
    wheelShell: document.querySelector("#wheel-shell"),
    wheelStatus: document.querySelector("#wheel-status"),
    pointerHit: document.querySelector("#pointer-hit"),
    spinButton: document.querySelector("#spin-button"),
    teaser: document.querySelector("#inline-teaser"),
    teaserLead: document.querySelector("#teaser-lead"),
    teaserCategory: document.querySelector("#teaser-category"),
    teaserLabel: document.querySelector("#teaser-label"),
    teaserCopy: document.querySelector("#teaser-copy"),
    teaserOpenButton: document.querySelector("#teaser-open"),
    teaserShareButton: document.querySelector("#teaser-share"),
    teaserCopyLinkButton: document.querySelector("#teaser-copy-link"),
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

export function renderModeControls(elements, activeModeKey) {
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
      "Manual Drift active. You have left the presets and started curating the omen yourself.";
  } else {
    const preset = MODE_PRESETS.find((item) => item.key === activeModeKey) ?? MODE_PRESETS[0];
    elements.modeDescription.textContent = preset.description;
  }
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

  const activeAccuracy = ACCURACY_LEVELS.find((level) => level.key === activeAccuracyKey) ?? ACCURACY_LEVELS[1];
  elements.accuracyDescription.textContent = `${activeAccuracy.statusLabel}. ${activeAccuracy.description}`;
}

export function renderOutcomeCount(elements, activeCount, totalCount) {
  elements.activeOutcomeCount.textContent = String(activeCount);
  elements.activeOutcomeCaption.textContent =
    activeCount === totalCount
      ? `All ${totalCount} fates currently loaded.`
      : `${activeCount} of ${totalCount} outcomes currently active.`;
}

export function renderCategoryLegend(elements, { categoryCounts, activeCategories }) {
  elements.categoryLegend.innerHTML = Object.values(CATEGORY_META).map((category) => {
    const isActive = activeCategories.has(category.key);
    return `
      <article class="filter-card rounded-[24px] p-4" data-active="${isActive}">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="h-3 w-3 rounded-full" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
            <div>
              <p class="text-sm font-semibold text-white">${category.name}</p>
              <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">${categoryCounts[category.key]} outcomes</p>
            </div>
          </div>
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
  }).join("");
}

export function renderHistory(elements, historyEntries, { highlightId = null } = {}) {
  if (!historyEntries.length) {
    elements.historyList.innerHTML = `
      <div class="history-empty rounded-[22px] px-4 py-5 text-sm leading-6 text-slate-400">
        No spins yet. The wheel is respectfully waiting to ruin your certainty.
      </div>
    `;
    return;
  }

  elements.historyList.innerHTML = historyEntries.map((entry) => {
    const category = CATEGORY_META[entry.category];
    return `
      <button
        type="button"
        class="history-item ${entry.id === highlightId ? "is-new" : ""} rounded-[22px] px-4 py-4"
        data-history-id="${entry.id}"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 gap-3">
            <span class="mt-1.5 h-2.5 w-2.5 flex-none rounded-full" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-white">${entry.label}</p>
              <p class="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">${category.name}</p>
            </div>
          </div>
          <time class="text-xs text-slate-500" datetime="${entry.isoTime}">${entry.displayTime}</time>
        </div>
      </button>
    `;
  }).join("");
}

export function renderTeaser(elements, { outcome, accuracy, displayTime }) {
  const category = CATEGORY_META[outcome.category];
  elements.teaser.classList.remove("hidden");
  elements.teaserLead.textContent = accuracy.teaserLead;
  elements.teaserCategory.textContent = `${category.name} • ${displayTime}`;
  elements.teaserCategory.style.color = category.color;
  elements.teaserLabel.textContent = outcome.label;
  elements.teaserCopy.textContent = outcome.interpretation;
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

export function renderDetailDeck(elements, { modeSummary, activeCategories, accuracy, activeCount }) {
  elements.detailModeName.textContent = modeSummary.name;
  elements.detailModeDescription.textContent = modeSummary.description;
  elements.detailCategorySummary.textContent =
    activeCategories.length
      ? activeCategories.map((categoryKey) => CATEGORY_META[categoryKey].name).join(" • ")
      : "No active categories. The wheel is currently fasting.";
  elements.detailAccuracySummary.textContent = `${accuracy.shortLabel} • ${accuracy.statusLabel}`;
  elements.detailPoolCount.textContent = `${activeCount} active outcomes`;
}

export function renderSocialSnippets(elements, outcomes) {
  const selections = [outcomes[0], outcomes[11], outcomes[40]].filter(Boolean);
  elements.socialSnippets.innerHTML = selections.map((outcome) => {
    const category = CATEGORY_META[outcome.category];
    return `
      <article class="social-card rounded-[28px] p-5">
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
          <span class="text-[11px] uppercase tracking-[0.22em] text-slate-500">${category.name}</span>
        </div>
        <p class="mt-4 text-lg font-semibold leading-7 text-white">"${outcome.label}"</p>
        <p class="mt-4 font-mono text-sm leading-7 text-slate-300">${outcome.shareText}</p>
      </article>
    `;
  }).join("");
}
