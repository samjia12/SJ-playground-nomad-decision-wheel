import {
  PLAYGROUND_URL,
  PROJECT_SHARE_BLURB,
} from "../data/outcomes.js";
import { buildHash, getAccuracyByKey } from "./state.js";

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const fallback = document.createElement("textarea");
  fallback.value = text;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "absolute";
  fallback.style.left = "-9999px";
  document.body.appendChild(fallback);
  fallback.select();
  document.execCommand("copy");
  document.body.removeChild(fallback);
}

export function buildDeepLink(state, resultId = state.activeOutcomeId) {
  const hash = buildHash({
    modeKey: state.modeKey,
    accuracyKey: state.accuracyKey,
    activeCategories: state.activeCategories,
    resultId,
  });

  return `${window.location.origin}${window.location.pathname}${hash}`;
}

export function buildResultShareText(outcome, state) {
  const accuracy = getAccuracyByKey(state.accuracyKey);
  return `${outcome.shareText} ${accuracy.shareSuffix}`.trim();
}

export function buildProjectShareText(state) {
  const deepLink = buildDeepLink(state, state.activeOutcomeId);
  return `${PROJECT_SHARE_BLURB} ${deepLink}`;
}

export async function shareResult({ outcome, state }) {
  const text = buildResultShareText(outcome, state);
  const url = buildDeepLink(state, outcome.id);
  const payload = {
    title: "Nomad Decision Wheel",
    text,
    url,
  };

  if (navigator.share) {
    await navigator.share(payload);
    return "Fate shared. Accountability remains delightfully non-transferable.";
  }

  await copyText(`${text} ${url}`);
  return "Result text and deep link copied. The omen is portable now.";
}

export async function copyDeepLink(state, resultId = state.activeOutcomeId) {
  const url = buildDeepLink(state, resultId);
  await copyText(url);
  return "Deep link copied. The exact ritual state can now travel.";
}

export async function shareProject(state) {
  const text = buildProjectShareText(state);
  const payload = {
    title: "Nomad Decision Wheel",
    text,
    url: buildDeepLink(state, state.activeOutcomeId),
  };

  if (navigator.share) {
    await navigator.share(payload);
    return "Project shared. The group chat has been ethically compromised.";
  }

  await copyText(text);
  return "Project blurb copied. Spread the ritual responsibly.";
}

export function getPlaygroundUrl() {
  return PLAYGROUND_URL;
}
