import { HISTORY_SCHEMA_VERSION, serialiseCategories } from "./state.js";

const STORAGE_KEY = "nomad-decision-wheel-history";
const LEGACY_STORAGE_KEYS = [
  "nomad-decision-wheel-v2-history",
  "nomad-decision-wheel-history",
];
const HISTORY_LIMIT = 20;

function createHistoryId() {
  return (
    window.crypto?.randomUUID?.() ??
    `spin-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

function parsePayload(rawValue) {
  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn("Unable to parse stored history payload", error);
    return null;
  }
}

function getRawHistoryPayload() {
  const currentPayload = localStorage.getItem(STORAGE_KEY);
  if (currentPayload) {
    return parsePayload(currentPayload);
  }

  for (const key of LEGACY_STORAGE_KEYS) {
    if (key === STORAGE_KEY) continue;
    const legacyPayload = localStorage.getItem(key);
    if (legacyPayload) {
      return parsePayload(legacyPayload);
    }
  }

  return null;
}

function normaliseHistoryEntry(entry, outcomeLookup) {
  const outcome = outcomeLookup.get(entry.outcomeId);
  if (!outcome) {
    return null;
  }

  const timestamp = new Date(entry.isoTime ?? Date.now());
  return {
    id: entry.id ?? createHistoryId(),
    outcomeId: outcome.id,
    title: entry.title ?? entry.label ?? outcome.title,
    label: entry.label ?? entry.title ?? outcome.title,
    category: entry.category ?? outcome.category,
    categoryLabel: entry.categoryLabel ?? outcome.categoryLabel,
    modeKey: entry.modeKey ?? "all-fates",
    accuracyKey: entry.accuracyKey ?? "ritual-grade",
    categories: Array.isArray(entry.categories) ? entry.categories : [outcome.category],
    deckSeed: entry.deckSeed ?? null,
    isoTime: timestamp.toISOString(),
    displayTime: formatHistoryTime(timestamp),
  };
}

function migrateHistoryPayload(payload, outcomeLookup) {
  if (!payload) return [];

  const sourceEntries = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.entries)
      ? payload.entries
      : [];

  return sourceEntries
    .map((entry) => normaliseHistoryEntry(entry, outcomeLookup))
    .filter(Boolean)
    .slice(0, HISTORY_LIMIT);
}

export function loadHistory(outcomes) {
  try {
    const outcomeLookup = new Map(outcomes.map((outcome) => [outcome.id, outcome]));
    const migratedEntries = migrateHistoryPayload(getRawHistoryPayload(), outcomeLookup);
    saveHistory(migratedEntries);
    return migratedEntries;
  } catch (error) {
    console.warn("Unable to read history from localStorage", error);
    return [];
  }
}

export function saveHistory(historyEntries) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: HISTORY_SCHEMA_VERSION,
      entries: historyEntries.slice(0, HISTORY_LIMIT),
    })
  );
}

export function formatHistoryTime(date) {
  const now = new Date();
  const sameDay = now.toDateString() === date.toDateString();
  return sameDay
    ? new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    : new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
}

export function buildHistoryEntry({ outcome, state }) {
  const timestamp = new Date();
  return {
    id: createHistoryId(),
    outcomeId: outcome.id,
    title: outcome.title,
    label: outcome.title,
    category: outcome.category,
    categoryLabel: outcome.categoryLabel,
    modeKey: state.modeKey,
    accuracyKey: state.accuracyKey,
    categories: serialiseCategories(state.activeCategories),
    deckSeed: state.deckSeed,
    isoTime: timestamp.toISOString(),
    displayTime: formatHistoryTime(timestamp),
  };
}

export function prependHistoryEntry(historyEntries, entry) {
  const deduped = historyEntries.filter((existing) => existing.outcomeId !== entry.outcomeId);
  return [entry, ...deduped].slice(0, HISTORY_LIMIT);
}
