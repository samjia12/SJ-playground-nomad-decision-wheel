import {
  ALL_CATEGORY_KEYS,
  CATEGORY_META,
  MODE_PRESETS,
} from "../data/outcomes.js";
import {
  CUSTOM_MODE_KEY,
  findMatchingPresetKey,
  getPresetByKey,
} from "./state.js";
import { refreshDeckSeed } from "./deck.js";

export function getCategoryCounts(outcomes) {
  return ALL_CATEGORY_KEYS.reduce((counts, key) => {
    counts[key] = outcomes.filter((outcome) => outcome.category === key).length;
    return counts;
  }, {});
}

export function getEligibleOutcomes(outcomes, activeCategories) {
  return outcomes.filter(
    (outcome) => outcome.enabled !== false && activeCategories.has(outcome.category)
  );
}

export function setModePreset(state, modeKey) {
  const preset = getPresetByKey(modeKey);
  state.modeKey = preset.key;
  state.activeCategories = new Set(preset.categories);
  state.activeOutcomeId = null;
  refreshDeckSeed(state);
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
  refreshDeckSeed(state);
}

export function isolateCategory(state, categoryKey) {
  state.activeCategories = new Set([categoryKey]);
  state.modeKey = findMatchingPresetKey(state.activeCategories);
  state.activeOutcomeId = null;
  refreshDeckSeed(state);
}

export function restoreAllCategories(state) {
  state.activeCategories = new Set(ALL_CATEGORY_KEYS);
  state.modeKey = "all-fates";
  state.activeOutcomeId = null;
  refreshDeckSeed(state);
}

export function resolveModeSummary(state) {
  if (state.modeKey === CUSTOM_MODE_KEY) {
    return {
      name: "Manual Drift",
      description:
        "You have departed from the presets and entered custom filter territory. Beautifully specific.",
      mappingLabel:
        [...state.activeCategories]
          .map((categoryKey) => CATEGORY_META[categoryKey]?.compactName ?? CATEGORY_META[categoryKey]?.name)
          .filter(Boolean)
          .join(" • ") || "Custom category stack",
    };
  }

  const preset = getPresetByKey(state.modeKey);
  return {
    ...preset,
    mappingLabel: preset.categories
      .map((categoryKey) =>
        ALL_CATEGORY_KEYS.includes(categoryKey)
          ? CATEGORY_META[categoryKey]?.compactName ?? CATEGORY_META[categoryKey]?.name
          : null
      )
      .filter(Boolean)
      .join(" • "),
  };
}

export function listPresets() {
  return MODE_PRESETS;
}
