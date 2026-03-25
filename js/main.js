import {
  CATEGORY_META,
  OUTCOME_LIBRARY,
} from "../data/outcomes.js";
import { dispatchNDWEvent } from "./analytics.js";
import {
  getCategoryCounts,
  getEligibleOutcomes,
  isolateCategory,
  resolveModeSummary,
  restoreAllCategories,
  setModePreset,
  toggleCategory,
} from "./filters.js";
import {
  MAX_VISIBLE_SEGMENTS,
  getActiveWheelPool,
} from "./deck.js";
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
  renderWheelMeta,
  setProjectShareFeedback,
  setSpinState,
  setTeaserFeedback,
  setWheelStatus,
} from "./dom.js";
import {
  createBrowserController,
  createModalController,
} from "./modal.js";
import {
  buildDeepLink,
  getPlaygroundUrl,
  shareProject,
  shareResult,
  copyDeepLink,
} from "./share.js";
import {
  createInitialState,
  getAccuracyByKey,
} from "./state.js";
import { applyHashState, syncHash } from "./url-state.js";
import {
  filterOutcomeLibrary,
  renderOutcomeBrowser,
} from "./outcome-browser.js";
import {
  getSpinDuration,
  getTargetRotation,
  renderWheel,
  spinWheel,
} from "./wheel.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = createInitialState();
state.historyExpanded = false;
const elements = getElements();
const modal = createModalController(elements);
const browser = createBrowserController(elements);
const libraryCategoryCounts = getCategoryCounts(OUTCOME_LIBRARY);
const outcomeLookup = new Map(OUTCOME_LIBRARY.map((outcome) => [outcome.id, outcome]));

function getOutcomeById(outcomeId) {
  return outcomeLookup.get(outcomeId) ?? null;
}

function findHistoryEntryByOutcomeId(outcomeId) {
  return state.history.find((entry) => entry.outcomeId === outcomeId) ?? null;
}

function createSyntheticEntry(outcomeId) {
  const outcome = getOutcomeById(outcomeId);
  return {
    id: `synthetic-${outcomeId}`,
    outcomeId,
    title: outcome?.title ?? "",
    label: outcome?.title ?? "",
    category: outcome?.category ?? "travel",
    displayTime: "Shared Link",
    isoTime: new Date().toISOString(),
  };
}

function getCurrentAccuracy() {
  return getAccuracyByKey(state.accuracyKey);
}

function getCurrentDeckState() {
  const eligibleOutcomes = getEligibleOutcomes(OUTCOME_LIBRARY, state.activeCategories);
  const activeWheelPool = getActiveWheelPool(eligibleOutcomes, state.deckSeed, {
    forcedOutcomeId: state.activeOutcomeId,
    maxSegments: MAX_VISIBLE_SEGMENTS,
  });

  return {
    libraryCount: OUTCOME_LIBRARY.length,
    eligibleOutcomes,
    activeWheelPool,
  };
}

function buildStateSnapshot(deckState = getCurrentDeckState()) {
  return {
    modeKey: state.modeKey,
    accuracyKey: state.accuracyKey,
    activeCategories: [...state.activeCategories],
    deckSeed: state.deckSeed,
    eligibleCount: deckState.eligibleOutcomes.length,
    activeDeckCount: deckState.activeWheelPool.length,
    activeOutcomeId: state.activeOutcomeId,
  };
}

function emitFiltersChanged(source) {
  const deckState = getCurrentDeckState();
  dispatchNDWEvent("ndw:filters_changed", {
    source,
    ...buildStateSnapshot(deckState),
  });
}

function getBrowserResults() {
  return filterOutcomeLibrary(OUTCOME_LIBRARY, {
    query: state.browserQuery,
    activeCategory: state.browserCategory,
  });
}

function emitBrowserSearch(source) {
  const results = getBrowserResults();
  dispatchNDWEvent("ndw:browser_search", {
    source,
    query: state.browserQuery,
    activeCategory: state.browserCategory,
    resultCount: results.length,
  });
}

function updateSpinAvailability({ eligibleOutcomes, activeWheelPool }) {
  if (!eligibleOutcomes.length || !activeWheelPool.length) {
    setSpinState(elements, { disabled: true, label: "Restore" });
    setWheelStatus(
      elements,
      "You filtered the ritual into oblivion. Restore all or switch modes.",
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
      setWheelStatus(elements, `Last landed on: ${activeOutcome.title}`, "neutral");
      return;
    }
  }

  if (activeWheelPool.length === 1) {
    setWheelStatus(
      elements,
      "Single-outcome mode armed. Repeats are now part of the ceremony.",
      "neutral"
    );
    return;
  }

  setWheelStatus(
    elements,
    `${activeWheelPool.length} active segments loaded from ${eligibleOutcomes.length} eligible outcomes.`,
    "neutral"
  );
}

function renderActiveStateSummary({ libraryCount, eligibleOutcomes, activeWheelPool }) {
  const accuracy = getCurrentAccuracy();
  const modeSummary = resolveModeSummary(state);
  renderModeControls(elements, {
    activeModeKey: state.modeKey,
    modeSummary,
  });
  renderAccuracyControls(elements, state.accuracyKey);
  renderOutcomeCount(elements, {
    libraryCount,
    eligibleCount: eligibleOutcomes.length,
    activeDeckCount: activeWheelPool.length,
    activeCategoryCount: state.activeCategories.size,
  });
  renderCategoryLegend(elements, {
    categoryCounts: libraryCategoryCounts,
    activeCategories: state.activeCategories,
  });
  renderDetailDeck(elements, {
    modeSummary,
    activeCategories: [...state.activeCategories],
    accuracy,
    libraryCount,
    eligibleCount: eligibleOutcomes.length,
    activeDeckCount: activeWheelPool.length,
    deckSeed: state.deckSeed,
    activeWheelPool,
  });
  renderWheelMeta(elements, {
    libraryCount,
    eligibleCount: eligibleOutcomes.length,
    activeDeckCount: activeWheelPool.length,
  });
}

function renderWheelState(activeWheelPool) {
  renderWheel({
    container: elements.wheelSegments,
    outcomes: activeWheelPool,
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

  const historyEntry =
    findHistoryEntryByOutcomeId(outcome.id) ?? createSyntheticEntry(outcome.id);
  renderTeaser(elements, {
    outcome,
    accuracy: getCurrentAccuracy(),
    displayTime: historyEntry.displayTime,
  });
}

function renderBrowserState() {
  if (elements.browserSearch.value !== state.browserQuery) {
    elements.browserSearch.value = state.browserQuery;
  }

  const browserResults = getBrowserResults();
  renderOutcomeBrowser(elements, {
    outcomes: browserResults,
    query: state.browserQuery,
    activeCategory: state.browserCategory,
    totalCount: OUTCOME_LIBRARY.length,
  });
}

function renderAll({ historyHighlightId = null } = {}) {
  const deckState = getCurrentDeckState();
  renderActiveStateSummary(deckState);
  renderWheelState(deckState.activeWheelPool);
  renderHistory(elements, state.history, {
    highlightId: historyHighlightId,
    expanded: state.historyExpanded,
  });
  renderTeaserState();
  renderBrowserState();
  if (elements.projectShareUrl) {
    const currentUrl = new URL(buildDeepLink(state));
    elements.projectShareUrl.textContent = `${currentUrl.host}${currentUrl.pathname}${currentUrl.hash}`;
  }
  updateSpinAvailability(deckState);
}

function chooseOutcomeIndex(activeWheelPool) {
  if (activeWheelPool.length <= 1) return 0;

  let nextIndex = Math.floor(Math.random() * activeWheelPool.length);
  let safety = 0;
  while (activeWheelPool[nextIndex]?.id === state.lastOutcomeId && safety < 12) {
    nextIndex = Math.floor(Math.random() * activeWheelPool.length);
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
  if (browser.isOpen()) {
    browser.close({ restoreFocus: false });
  }

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

function openBrowser() {
  if (modal.isOpen()) {
    modal.close({ restoreFocus: false });
  }

  renderBrowserState();
  browser.open({ initialFocus: elements.browserSearch });
}

async function handleSpin() {
  const { eligibleOutcomes, activeWheelPool } = getCurrentDeckState();
  if (!eligibleOutcomes.length || !activeWheelPool.length || state.status === "spinning") return;

  const accuracy = getCurrentAccuracy();
  const selectedIndex = chooseOutcomeIndex(activeWheelPool);
  const outcome = activeWheelPool[selectedIndex];
  const targetRotation = getTargetRotation({
    currentRotation: state.currentRotation,
    targetIndex: selectedIndex,
    outcomeCount: activeWheelPool.length,
    accuracy,
    reducedMotion: prefersReducedMotion.matches,
  });

  state.status = "spinning";
  state.activeOutcomeId = null;
  state.modalResultId = null;
  dispatchNDWEvent("ndw:spin_start", {
    ...buildStateSnapshot({ eligibleOutcomes, activeWheelPool }),
    targetOutcomeId: outcome.id,
  });
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
  dispatchNDWEvent("ndw:spin_end", {
    ...buildStateSnapshot({ eligibleOutcomes, activeWheelPool }),
    outcomeId: outcome.id,
    outcomeTitle: outcome.title,
    outcomeCategory: outcome.category,
    historyId: historyEntry.id,
  });
  setWheelStatus(elements, `${accuracy.teaserLead} ${outcome.title}`, "neutral");

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
  if (entry.deckSeed) {
    state.deckSeed = entry.deckSeed;
  }
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
    emitFiltersChanged("mode_preset");
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
      emitFiltersChanged("category_toggle");
      syncHash(state);
      renderAll();
      return;
    }

    if (only) {
      isolateCategory(state, only.dataset.categoryOnly);
      state.modalResultId = null;
      emitFiltersChanged("category_only");
      syncHash(state);
      renderAll();
    }
  });

  elements.restoreFiltersButton.addEventListener("click", () => {
    restoreAllCategories(state);
    emitFiltersChanged("restore_all");
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

  elements.teaserSpinButton.addEventListener("click", handleSpin);

  elements.teaserOpenButton.addEventListener("click", () => {
    if (!state.activeOutcomeId) return;
    const outcome = getOutcomeById(state.activeOutcomeId);
    const entry =
      findHistoryEntryByOutcomeId(state.activeOutcomeId) ??
      createSyntheticEntry(state.activeOutcomeId);
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

  elements.teaserCopyButton.addEventListener("click", async () => {
    if (!state.activeOutcomeId) return;
    const message = await safelyRunShare(() => copyDeepLink(state, state.activeOutcomeId));
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

  if (elements.historyToggleButton) {
    elements.historyToggleButton.addEventListener("click", () => {
      state.historyExpanded = !state.historyExpanded;
      renderAll();
    });
  }

  elements.projectShareButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const message = await safelyRunShare(() => shareProject(state));
      setProjectShareFeedback(elements, message);
    });
  });

  elements.browseButtons.forEach((button) => {
    button.addEventListener("click", openBrowser);
  });

  elements.browserSearch.addEventListener("input", (event) => {
    state.browserQuery = event.target.value;
    renderBrowserState();
    emitBrowserSearch("query");
  });

  elements.browserSearch.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      const firstResultAction = elements.browserResults.querySelector("button, a[href]");
      if (firstResultAction instanceof HTMLElement) {
        event.preventDefault();
        firstResultAction.focus();
      }
    }
  });

  elements.browserFilterLegend.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-browser-filter]");
    if (!trigger) return;
    state.browserCategory = trigger.dataset.browserFilter;
    renderBrowserState();
    emitBrowserSearch("category_filter");
  });

  elements.browserResults.addEventListener("click", (event) => {
    const showCategory = event.target.closest("[data-browser-show-category]");
    const onlyCategory = event.target.closest("[data-browser-only-category]");

    if (showCategory) {
      state.browserCategory = showCategory.dataset.browserShowCategory;
      renderBrowserState();
      emitBrowserSearch("show_category");
      return;
    }

    if (onlyCategory) {
      isolateCategory(state, onlyCategory.dataset.browserOnlyCategory);
      browser.close({ restoreFocus: false });
      emitFiltersChanged("browser_only_category");
      syncHash(state);
      renderAll();
      elements.spinButton.focus();
    }
  });

  elements.browserEmpty.addEventListener("click", (event) => {
    const clearQuery = event.target.closest("[data-browser-clear-query]");
    const resetView = event.target.closest("[data-browser-reset-view]");

    if (clearQuery) {
      state.browserQuery = "";
      elements.browserSearch.value = "";
      renderBrowserState();
      emitBrowserSearch("clear_query");
      elements.browserSearch.focus();
      return;
    }

    if (resetView) {
      state.browserQuery = "";
      state.browserCategory = "all";
      elements.browserSearch.value = "";
      renderBrowserState();
      emitBrowserSearch("reset_view");
      elements.browserSearch.focus();
    }
  });

  elements.browserPanel.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== elements.browserSearch) {
      event.preventDefault();
      elements.browserSearch.focus();
      elements.browserSearch.select();
    }
  });

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", renderAll);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(renderAll);
  }
}

function restoreSharedResultFromUrl() {
  if (!state.activeOutcomeId) return;
  const outcome = getOutcomeById(state.activeOutcomeId);
  if (!outcome) return;

  renderAll();
  window.setTimeout(() => {
    openOutcomeModal(outcome, createSyntheticEntry(outcome.id));
  }, prefersReducedMotion.matches ? 0 : 220);
}

function init() {
  state.history = loadHistory(OUTCOME_LIBRARY);
  renderSocialSnippets(elements, OUTCOME_LIBRARY);

  const hasSearchState = applyHashState(state, window.location.search, OUTCOME_LIBRARY);
  const hasHashState = applyHashState(state, window.location.hash, OUTCOME_LIBRARY);
  const hadResultInUrl = hasSearchState || hasHashState;

  syncHash(state);
  bindEvents();
  renderAll();

  if (!hadResultInUrl && state.history[0]) {
    state.lastOutcomeId = state.history[0].outcomeId;
  }

  if (hadResultInUrl) {
    restoreSharedResultFromUrl();
  }
}

document.addEventListener("DOMContentLoaded", init, { once: true });

document.querySelectorAll("[data-playground-link]").forEach((link) => {
  link.href = getPlaygroundUrl();
});
