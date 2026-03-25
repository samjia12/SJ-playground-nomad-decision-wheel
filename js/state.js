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
