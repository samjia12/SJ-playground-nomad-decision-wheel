const STORAGE_KEY = "nomad-decision-wheel-v2-history";
const HISTORY_LIMIT = 15;

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, HISTORY_LIMIT) : [];
  } catch (error) {
    console.warn("Unable to read history from localStorage", error);
    return [];
  }
}

export function saveHistory(historyEntries) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(historyEntries.slice(0, HISTORY_LIMIT))
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
    id:
      window.crypto?.randomUUID?.() ??
      `spin-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    outcomeId: outcome.id,
    label: outcome.label,
    category: outcome.category,
    modeKey: state.modeKey,
    accuracyKey: state.accuracyKey,
    categories: [...state.activeCategories],
    isoTime: timestamp.toISOString(),
    displayTime: formatHistoryTime(timestamp),
  };
}

export function prependHistoryEntry(historyEntries, entry) {
  return [entry, ...historyEntries].slice(0, HISTORY_LIMIT);
}
