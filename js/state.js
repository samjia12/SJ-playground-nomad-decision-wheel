import {
  ACCURACY_LEVELS,
  ALL_CATEGORY_KEYS,
  MODE_PRESETS,
} from "../data/outcomes.js";

export const CUSTOM_MODE_KEY = "manual-drift";
export const HISTORY_SCHEMA_VERSION = 3;

const presetMap = new Map(MODE_PRESETS.map((preset) => [preset.key, preset]));
const accuracyMap = new Map(ACCURACY_LEVELS.map((level) => [level.key, level]));

export function createDeckSeed() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function sanitiseDeckSeed(value) {
  if (!value) return createDeckSeed();
  return String(value).replace(/[^a-z0-9-]/gi, "").slice(0, 32) || createDeckSeed();
}

export function getPresetByKey(modeKey) {
  return presetMap.get(modeKey) ?? presetMap.get("all-fates");
}

export function getAccuracyByKey(accuracyKey) {
  return accuracyMap.get(accuracyKey) ?? accuracyMap.get("ritual-grade");
}

export function createInitialState() {
  return {
    modeKey: "all-fates",
    accuracyKey: "ritual-grade",
    activeCategories: new Set(ALL_CATEGORY_KEYS),
    activeOutcomeId: null,
    currentRotation: 0,
    lastOutcomeId: null,
    deckSeed: createDeckSeed(),
    status: "idle",
    history: [],
    modalResultId: null,
    pointerFlash: false,
    browserQuery: "",
    browserCategory: "all",
  };
}

export function cloneCategorySet(categorySet) {
  return new Set([...categorySet]);
}

export function serialiseCategories(categorySet) {
  return [...categorySet].sort();
}

export function findMatchingPresetKey(categorySet) {
  const current = serialiseCategories(categorySet).join(",");
  const match = MODE_PRESETS.find(
    (preset) => preset.categories.slice().sort().join(",") === current
  );
  return match?.key ?? CUSTOM_MODE_KEY;
}

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

  if (modeKey && presetMap.has(modeKey)) {
    state.modeKey = modeKey;
    state.activeCategories = new Set(getPresetByKey(modeKey).categories);
  }

  if (accuracyKey && accuracyMap.has(accuracyKey)) {
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
