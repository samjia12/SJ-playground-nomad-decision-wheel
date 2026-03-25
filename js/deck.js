import { createDeckSeed } from "./state.js";

export const MAX_VISIBLE_SEGMENTS = 50;

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
