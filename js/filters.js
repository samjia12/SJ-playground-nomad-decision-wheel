import {
  ALL_CATEGORY_KEYS,
  MODE_PRESETS,
} from "../data/outcomes.js";
import {
  CUSTOM_MODE_KEY,
  findMatchingPresetKey,
  getPresetByKey,
} from "./state.js";

export function getCategoryCounts(outcomes) {
  return ALL_CATEGORY_KEYS.reduce((counts, key) => {
    counts[key] = outcomes.filter((outcome) => outcome.category === key).length;
    return counts;
  }, {});
}

export function getActiveOutcomes(outcomes, activeCategories) {
  return outcomes.filter((outcome) => activeCategories.has(outcome.category));
}

export function setModePreset(state, modeKey) {
  const preset = getPresetByKey(modeKey);
  state.modeKey = preset.key;
  state.activeCategories = new Set(preset.categories);
  state.activeOutcomeId = null;
}

export function toggleCategory(state, categoryKey) {
  const next = new Set(state.activeCategories);
  if (next.has(categoryKey)) {
    next.delete(categoryKey);
  } else {
    next.add(categoryKey);
  }
  state.activeCategories = next;
  state.modeKey = findMatchingPresetKey(next);
  state.activeOutcomeId = null;
}

export function isolateCategory(state, categoryKey) {
  state.activeCategories = new Set([categoryKey]);
  state.modeKey = findMatchingPresetKey(state.activeCategories);
  state.activeOutcomeId = null;
}

export function restoreAllCategories(state) {
  state.activeCategories = new Set(ALL_CATEGORY_KEYS);
  state.modeKey = "all-fates";
  state.activeOutcomeId = null;
}

export function resolveModeSummary(state) {
  if (state.modeKey === CUSTOM_MODE_KEY) {
    return {
      name: "Manual Drift",
      description:
        "You have departed from the presets and entered custom filter territory. Beautifully specific.",
    };
  }

  return getPresetByKey(state.modeKey);
}

export function listPresets() {
  return MODE_PRESETS;
}
