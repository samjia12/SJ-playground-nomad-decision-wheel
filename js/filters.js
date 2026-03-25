import {
  ALL_CATEGORY_KEYS,
  CATEGORY_META,
  MODE_PRESETS,
} from "../data/outcomes.js";
import {
  CUSTOM_MODE_KEY,
  createDeckSeed,
  findMatchingPresetKey,
  getPresetByKey,
} from "./state.js";

export const MAX_VISIBLE_SEGMENTS = 50;

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

function hashSeed(seed) {
  let hash = 1779033703 ^ seed.length;
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

function createSeededRandom(seed) {
  const generator = hashSeed(seed);
  return () => generator() / 4294967296;
}

export function getActiveWheelPool(
  eligibleOutcomes,
  deckSeed,
  { forcedOutcomeId = null, maxSegments = MAX_VISIBLE_SEGMENTS } = {}
) {
  if (eligibleOutcomes.length <= maxSegments) {
    return eligibleOutcomes;
  }

  const random = createSeededRandom(String(deckSeed));
  const shuffled = [...eligibleOutcomes];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  const activeDeck = shuffled.slice(0, maxSegments);
  if (!forcedOutcomeId || activeDeck.some((outcome) => outcome.id === forcedOutcomeId)) {
    return activeDeck;
  }

  const forcedOutcome = eligibleOutcomes.find((outcome) => outcome.id === forcedOutcomeId);
  if (!forcedOutcome) {
    return activeDeck;
  }

  return [...activeDeck.slice(0, -1), forcedOutcome];
}

export function refreshDeckSeed(state) {
  state.deckSeed = createDeckSeed();
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
