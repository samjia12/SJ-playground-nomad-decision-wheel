import {
  SITE_CONFIG,
  getPlaygroundUrl as getConfiguredPlaygroundUrl,
  getProjectShareBaseUrl,
} from "../data/site-config.js";
import { dispatchNDWEvent } from "./analytics.js";
import { getAccuracyByKey } from "./state.js";
import { buildHash } from "./url-state.js";

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
    deckSeed: state.deckSeed,
  });

  return `${getProjectShareBaseUrl()}${hash}`;
}

export function buildResultShareText(outcome, state) {
  const accuracy = getAccuracyByKey(state.accuracyKey);
  return `${outcome.shareText} ${accuracy.shareSuffix}`.trim();
}

export function buildProjectShareText(state) {
  const deepLink = buildDeepLink(state, state.activeOutcomeId);
  return `${SITE_CONFIG.projectShareBlurb} ${deepLink}`;
}

export async function shareResult({ outcome, state }) {
  const text = buildResultShareText(outcome, state);
  const url = buildDeepLink(state, outcome.id);
  const payload = {
    title: SITE_CONFIG.siteName,
    text,
    url,
  };

  if (navigator.share) {
    await navigator.share(payload);
    dispatchNDWEvent("ndw:share_result", {
      method: "web-share",
      outcomeId: outcome.id,
      outcomeTitle: outcome.title,
      url,
      modeKey: state.modeKey,
      accuracyKey: state.accuracyKey,
      deckSeed: state.deckSeed,
    });
    return "Fate shared. Accountability remains delightfully non-transferable.";
  }

  await copyText(`${text} ${url}`);
  dispatchNDWEvent("ndw:share_result", {
    method: "clipboard",
    outcomeId: outcome.id,
    outcomeTitle: outcome.title,
    url,
    modeKey: state.modeKey,
    accuracyKey: state.accuracyKey,
    deckSeed: state.deckSeed,
  });
  return "Result text and deep link copied. The omen is portable now.";
}

export async function copyDeepLink(state, resultId = state.activeOutcomeId) {
  const url = buildDeepLink(state, resultId);
  await copyText(url);
  dispatchNDWEvent("ndw:share_result", {
    method: "copy-link",
    outcomeId: resultId,
    url,
    modeKey: state.modeKey,
    accuracyKey: state.accuracyKey,
    deckSeed: state.deckSeed,
  });
  return "Deep link copied. The exact ritual state can now travel.";
}

export async function shareProject(state) {
  const text = buildProjectShareText(state);
  const payload = {
    title: SITE_CONFIG.siteName,
    text,
    url: buildDeepLink(state, state.activeOutcomeId),
  };

  if (navigator.share) {
    await navigator.share(payload);
    dispatchNDWEvent("ndw:share_project", {
      method: "web-share",
      url: payload.url,
      modeKey: state.modeKey,
      accuracyKey: state.accuracyKey,
      deckSeed: state.deckSeed,
      activeCategories: [...state.activeCategories],
    });
    return "Project shared. The group chat has been ethically compromised.";
  }

  await copyText(text);
  dispatchNDWEvent("ndw:share_project", {
    method: "clipboard",
    url: payload.url,
    modeKey: state.modeKey,
    accuracyKey: state.accuracyKey,
    deckSeed: state.deckSeed,
    activeCategories: [...state.activeCategories],
  });
  return "Project blurb copied. Spread the ritual responsibly.";
}

export function getPlaygroundUrl() {
  return getConfiguredPlaygroundUrl();
}
