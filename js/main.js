import {
  CATEGORY_META,
  OUTCOMES,
} from "../data/outcomes.js";
import {
  getCategoryCounts,
  getActiveOutcomes,
  isolateCategory,
  resolveModeSummary,
  restoreAllCategories,
  setModePreset,
  toggleCategory,
} from "./filters.js";
import {
  buildHistoryEntry,
  loadHistory,
  prependHistoryEntry,
  saveHistory,
} from "./history.js";
import {
  flashPointer,
  getElements,
  hideTeaser,
  renderAccuracyControls,
  renderCategoryLegend,
  renderDetailDeck,
  renderHistory,
  renderModeControls,
  renderOutcomeCount,
  renderSocialSnippets,
  renderTeaser,
  setProjectShareFeedback,
  setSpinState,
  setTeaserFeedback,
  setWheelStatus,
} from "./dom.js";
import { createModalController } from "./modal.js";
import {
  buildDeepLink,
  copyDeepLink,
  getPlaygroundUrl,
  shareProject,
  shareResult,
} from "./share.js";
import {
  applyHashState,
  createInitialState,
  getAccuracyByKey,
  syncHash,
} from "./state.js";
import {
  getSpinDuration,
  getTargetRotation,
  renderWheel,
  spinWheel,
} from "./wheel.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = createInitialState();
const elements = getElements();
const modal = createModalController(elements);
const categoryCounts = getCategoryCounts(OUTCOMES);

function getOutcomeById(outcomeId) {
  return OUTCOMES.find((outcome) => outcome.id === outcomeId) ?? null;
}

function findHistoryEntryByOutcomeId(outcomeId) {
  return state.history.find((entry) => entry.outcomeId === outcomeId) ?? null;
}

function createSyntheticEntry(outcomeId) {
  return {
    id: `synthetic-${outcomeId}`,
    outcomeId,
    label: getOutcomeById(outcomeId)?.label ?? "",
    category: getOutcomeById(outcomeId)?.category ?? "travel",
    displayTime: "Shared Link",
    isoTime: new Date().toISOString(),
  };
}

function getCurrentAccuracy() {
  return getAccuracyByKey(state.accuracyKey);
}

function getCurrentActiveOutcomes() {
  return getActiveOutcomes(OUTCOMES, state.activeCategories);
}

function updateSpinAvailability(activeOutcomes) {
  if (!activeOutcomes.length) {
    setSpinState(elements, { disabled: true, label: "Restore" });
    setWheelStatus(
      elements,
      "No outcomes left in the ritual pool. Restore all filters and try again.",
      "warning"
    );
    return;
  }

  const label = state.status === "spinning" ? "Spinning" : "Spin";
  setSpinState(elements, {
    disabled: state.status === "spinning",
    label,
  });

  if (state.status === "spinning") {
    return;
  }

  if (state.activeOutcomeId) {
    const activeOutcome = getOutcomeById(state.activeOutcomeId);
    if (activeOutcome) {
      setWheelStatus(elements, `Last landed on: ${activeOutcome.label}`, "neutral");
      return;
    }
  }

  if (activeOutcomes.length === 1) {
    setWheelStatus(
      elements,
      "Single-outcome mode armed. Repeats are now part of the ceremony.",
      "neutral"
    );
    return;
  }

  setWheelStatus(
    elements,
    "50-segment ritualware, now filtered to your current appetite for consequences.",
    "neutral"
  );
}

function renderActiveStateSummary(activeOutcomes) {
  const accuracy = getCurrentAccuracy();
  const modeSummary = resolveModeSummary(state);
  renderModeControls(elements, state.modeKey);
  renderAccuracyControls(elements, state.accuracyKey);
  renderOutcomeCount(elements, activeOutcomes.length, OUTCOMES.length);
  renderCategoryLegend(elements, {
    categoryCounts,
    activeCategories: state.activeCategories,
  });
  renderDetailDeck(elements, {
    modeSummary,
    activeCategories: [...state.activeCategories],
    accuracy,
    activeCount: activeOutcomes.length,
  });
}

function renderWheelState(activeOutcomes) {
  renderWheel({
    container: elements.wheelSegments,
    outcomes: activeOutcomes,
    categoryMeta: CATEGORY_META,
    selectedOutcomeId: state.activeOutcomeId,
  });
  elements.wheelShell.dataset.landed = state.activeOutcomeId ? "true" : "false";
}

function renderTeaserState() {
  if (!state.activeOutcomeId) {
    hideTeaser(elements);
    return;
  }

  const outcome = getOutcomeById(state.activeOutcomeId);
  if (!outcome) {
    hideTeaser(elements);
    return;
  }

  const historyEntry = findHistoryEntryByOutcomeId(outcome.id) ?? createSyntheticEntry(outcome.id);
  renderTeaser(elements, {
    outcome,
    accuracy: getCurrentAccuracy(),
    displayTime: historyEntry.displayTime,
  });
}

function renderAll({ historyHighlightId = null } = {}) {
  const activeOutcomes = getCurrentActiveOutcomes();
  renderActiveStateSummary(activeOutcomes);
  renderWheelState(activeOutcomes);
  renderHistory(elements, state.history, { highlightId: historyHighlightId });
  renderTeaserState();
  updateSpinAvailability(activeOutcomes);
}

function chooseOutcomeIndex(activeOutcomes) {
  if (activeOutcomes.length <= 1) return 0;

  let nextIndex = Math.floor(Math.random() * activeOutcomes.length);
  let safety = 0;
  while (activeOutcomes[nextIndex]?.id === state.lastOutcomeId && safety < 12) {
    nextIndex = Math.floor(Math.random() * activeOutcomes.length);
    safety += 1;
  }
  return nextIndex;
}

async function safelyRunShare(action) {
  try {
    return await action();
  } catch (error) {
    if (error?.name === "AbortError") {
      return "Sharing cancelled. The omen remains private.";
    }
    console.warn("Share action failed", error);
    return "Sharing failed with style. Try the copy-link fallback.";
  }
}

function openOutcomeModal(outcome, historyEntry) {
  modal.open({
    outcome,
    historyEntry,
    accuracy: getCurrentAccuracy(),
    categoryMeta: CATEGORY_META,
    handlers: {
      onClose: () => {
        state.modalResultId = null;
      },
      onShare: () => safelyRunShare(() => shareResult({ outcome, state })),
      onCopyLink: () => safelyRunShare(() => copyDeepLink(state, outcome.id)),
      onSpinAgain: () => {
        state.modalResultId = null;
        handleSpin();
      },
    },
  });
}

async function handleSpin() {
  const activeOutcomes = getCurrentActiveOutcomes();
  if (!activeOutcomes.length || state.status === "spinning") return;

  const accuracy = getCurrentAccuracy();
  const selectedIndex = chooseOutcomeIndex(activeOutcomes);
  const outcome = activeOutcomes[selectedIndex];
  const targetRotation = getTargetRotation({
    currentRotation: state.currentRotation,
    targetIndex: selectedIndex,
    outcomeCount: activeOutcomes.length,
    accuracy,
    reducedMotion: prefersReducedMotion.matches,
  });

  state.status = "spinning";
  state.activeOutcomeId = null;
  renderAll();
  setWheelStatus(
    elements,
    "Wheel spinning. Your certainty is being tastefully destabilized.",
    "active"
  );

  state.currentRotation = await spinWheel({
    shell: elements.wheelShell,
    currentRotation: state.currentRotation,
    targetRotation,
    duration: getSpinDuration({
      accuracy,
      reducedMotion: prefersReducedMotion.matches,
    }),
    reducedMotion: prefersReducedMotion.matches,
  });

  state.status = "revealed";
  state.activeOutcomeId = outcome.id;
  state.lastOutcomeId = outcome.id;
  state.modalResultId = outcome.id;

  const historyEntry = buildHistoryEntry({ outcome, state });
  state.history = prependHistoryEntry(state.history, historyEntry);
  saveHistory(state.history);
  syncHash(state);
  renderAll({ historyHighlightId: historyEntry.id });
  flashPointer(elements);
  setWheelStatus(elements, `${accuracy.teaserLead} ${outcome.label}`, "neutral");

  window.setTimeout(() => {
    openOutcomeModal(outcome, historyEntry);
  }, prefersReducedMotion.matches ? 0 : 260);
}

function applyHistoryEntry(entry) {
  state.modeKey = entry.modeKey;
  state.accuracyKey = entry.accuracyKey;
  state.activeCategories = new Set(entry.categories);
  state.activeOutcomeId = entry.outcomeId;
  state.lastOutcomeId = entry.outcomeId;
  state.modalResultId = entry.outcomeId;
  syncHash(state);
  renderAll();
  const outcome = getOutcomeById(entry.outcomeId);
  if (outcome) {
    openOutcomeModal(outcome, entry);
  }
}

function bindEvents() {
  elements.modeControls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode-key]");
    if (!button) return;
    setModePreset(state, button.dataset.modeKey);
    state.modalResultId = null;
    syncHash(state);
    renderAll();
  });

  elements.accuracyControls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-accuracy-key]");
    if (!button) return;
    state.accuracyKey = button.dataset.accuracyKey;
    syncHash(state);
    renderAll();
  });

  elements.categoryLegend.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-category-toggle]");
    const only = event.target.closest("[data-category-only]");

    if (toggle) {
      toggleCategory(state, toggle.dataset.categoryToggle);
      state.modalResultId = null;
      syncHash(state);
      renderAll();
      return;
    }

    if (only) {
      isolateCategory(state, only.dataset.categoryOnly);
      state.modalResultId = null;
      syncHash(state);
      renderAll();
    }
  });

  elements.restoreFiltersButton.addEventListener("click", () => {
    restoreAllCategories(state);
    syncHash(state);
    renderAll();
  });

  elements.spinButton.addEventListener("click", handleSpin);
  elements.spinButton.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && !elements.spinButton.disabled) {
      event.preventDefault();
      handleSpin();
    }
  });

  elements.teaserOpenButton.addEventListener("click", () => {
    if (!state.activeOutcomeId) return;
    const outcome = getOutcomeById(state.activeOutcomeId);
    const entry = findHistoryEntryByOutcomeId(state.activeOutcomeId) ?? createSyntheticEntry(state.activeOutcomeId);
    if (outcome) {
      openOutcomeModal(outcome, entry);
    }
  });

  elements.teaserShareButton.addEventListener("click", async () => {
    if (!state.activeOutcomeId) return;
    const outcome = getOutcomeById(state.activeOutcomeId);
    if (!outcome) return;
    const message = await safelyRunShare(() => shareResult({ outcome, state }));
    setTeaserFeedback(elements, message);
  });

  elements.teaserCopyLinkButton.addEventListener("click", async () => {
    const message = await safelyRunShare(() => copyDeepLink(state));
    setTeaserFeedback(elements, message);
  });

  elements.historyList.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-history-id]");
    if (!trigger) return;
    const entry = state.history.find((item) => item.id === trigger.dataset.historyId);
    if (entry) {
      applyHistoryEntry(entry);
    }
  });

  elements.clearHistoryButton.addEventListener("click", () => {
    state.history = [];
    saveHistory(state.history);
    renderAll();
  });

  elements.projectShareButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const message = await safelyRunShare(() => shareProject(state));
      setProjectShareFeedback(elements, message);
    });
  });

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", renderAll);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(renderAll);
  }
}

function restoreSharedResultFromHash() {
  if (!state.activeOutcomeId) return;
  const outcome = getOutcomeById(state.activeOutcomeId);
  if (!outcome) return;

  renderAll();
  window.setTimeout(() => {
    openOutcomeModal(outcome, createSyntheticEntry(outcome.id));
  }, prefersReducedMotion.matches ? 0 : 220);
}

function init() {
  state.history = loadHistory();
  renderSocialSnippets(elements, OUTCOMES);
  const hadResultInHash = applyHashState(state, window.location.hash, OUTCOMES);
  syncHash(state);
  bindEvents();
  renderAll();

  if (!hadResultInHash && state.history[0]) {
    state.lastOutcomeId = state.history[0].outcomeId;
  }

  if (hadResultInHash) {
    restoreSharedResultFromHash();
  }
}

document.addEventListener("DOMContentLoaded", init, { once: true });

document.querySelectorAll("[data-playground-link]").forEach((link) => {
  link.href = getPlaygroundUrl();
});

const projectShareUrl = document.querySelector("#project-share-url");
if (projectShareUrl) {
  projectShareUrl.textContent = new URL(buildDeepLink(state)).hostname;
}
