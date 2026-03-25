import {
  ACCURACY_LEVELS,
  ALL_CATEGORY_KEYS,
  MODE_PRESETS,
} from "../data/outcomes.js";
import {
  findMatchingPresetKey,
  getPresetByKey,
  sanitiseDeckSeed,
  serialiseCategories,
} from "./state.js";

const presetKeys = new Set(MODE_PRESETS.map((preset) => preset.key));
const accuracyKeys = new Set(ACCURACY_LEVELS.map((level) => level.key));

export function buildHash({
  modeKey,
  accuracyKey,
  activeCategories,
  resultId,
  deckSeed,
}) {
  const params = new URLSearchParams();
  params.set("mode", modeKey);
  params.set("accuracy", accuracyKey);
  params.set("categories", serialiseCategories(activeCategories).join(","));
  params.set("deck", sanitiseDeckSeed(deckSeed));
  if (resultId) {
    params.set("result", String(resultId));
  }
  return `#${params.toString()}`;
}

function parseStateParams(fragment) {
  if (!fragment || fragment === "#" || fragment === "?") {
    return new URLSearchParams();
  }

  return new URLSearchParams(fragment.replace(/^[#?]/, ""));
}

function resolveLegacyResultId(resultParam, outcomes) {
  const parsedResult = Number.parseInt(resultParam, 10);
  if (Number.isNaN(parsedResult)) return null;

  if (outcomes.some((outcome) => outcome.id === parsedResult)) {
    return parsedResult;
  }

  return outcomes[parsedResult - 1]?.id ?? null;
}

export function applyHashState(state, fragment, outcomes) {
  const params = parseStateParams(fragment);
  if (![...params.keys()].length) return false;

  const modeKey = params.get("mode");
  const accuracyKey = params.get("accuracy");
  const categoriesParam = params.get("categories");
  const resultParam = params.get("result");
  const deckParam = params.get("deck");

  if (modeKey && presetKeys.has(modeKey)) {
    state.modeKey = modeKey;
    state.activeCategories = new Set(getPresetByKey(modeKey).categories);
  }

  if (accuracyKey && accuracyKeys.has(accuracyKey)) {
    state.accuracyKey = accuracyKey;
  }

  if (deckParam) {
    state.deckSeed = sanitiseDeckSeed(deckParam);
  }

  if (params.has("categories")) {
    const requestedCategories = categoriesParam
      .split(",")
      .map((value) => value.trim())
      .filter((value) => ALL_CATEGORY_KEYS.includes(value));
    state.activeCategories = new Set(requestedCategories);
    state.modeKey = findMatchingPresetKey(state.activeCategories);
  }

  if (resultParam) {
    const resolvedResultId = resolveLegacyResultId(resultParam, outcomes);
    if (resolvedResultId) {
      state.activeOutcomeId = resolvedResultId;
      state.modalResultId = resolvedResultId;
      return true;
    }
  }

  return false;
}

export function syncHash(state) {
  const nextHash = buildHash({
    modeKey: state.modeKey,
    accuracyKey: state.accuracyKey,
    activeCategories: state.activeCategories,
    resultId: state.activeOutcomeId,
    deckSeed: state.deckSeed,
  });

  if (window.location.hash !== nextHash) {
    history.replaceState(null, "", nextHash);
  }
}
