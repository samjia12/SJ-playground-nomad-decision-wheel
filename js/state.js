import {
  ACCURACY_LEVELS,
  ALL_CATEGORY_KEYS,
  MODE_PRESETS,
} from "../data/outcomes.js";

export const CUSTOM_MODE_KEY = "manual-drift";

const presetMap = new Map(MODE_PRESETS.map((preset) => [preset.key, preset]));
const accuracyMap = new Map(ACCURACY_LEVELS.map((level) => [level.key, level]));

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
    status: "idle",
    history: [],
    modalResultId: null,
    pointerFlash: false,
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

export function buildHash({ modeKey, accuracyKey, activeCategories, resultId }) {
  const params = new URLSearchParams();
  params.set("mode", modeKey);
  params.set("accuracy", accuracyKey);
  params.set("categories", serialiseCategories(activeCategories).join(","));
  if (resultId) {
    params.set("result", String(resultId));
  }
  return `#${params.toString()}`;
}

export function applyHashState(state, hash, outcomes) {
  if (!hash || hash === "#") return false;

  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const modeKey = params.get("mode");
  const accuracyKey = params.get("accuracy");
  const categoriesParam = params.get("categories");
  const resultParam = params.get("result");

  if (modeKey && presetMap.has(modeKey)) {
    state.modeKey = modeKey;
    state.activeCategories = new Set(getPresetByKey(modeKey).categories);
  }

  if (accuracyKey && accuracyMap.has(accuracyKey)) {
    state.accuracyKey = accuracyKey;
  }

  if (categoriesParam) {
    const requestedCategories = categoriesParam
      .split(",")
      .map((value) => value.trim())
      .filter((value) => ALL_CATEGORY_KEYS.includes(value));
    state.activeCategories = new Set(requestedCategories);
    state.modeKey = findMatchingPresetKey(state.activeCategories);
  }

  if (resultParam) {
    const parsedResult = Number.parseInt(resultParam, 10);
    if (outcomes.some((outcome) => outcome.id === parsedResult)) {
      state.activeOutcomeId = parsedResult;
      state.modalResultId = parsedResult;
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
  });

  if (window.location.hash !== nextHash) {
    history.replaceState(null, "", nextHash);
  }
}
