export const SITE_CONFIG = Object.freeze({
  siteName: "Nomad Decision Wheel",
  siteOrigin: "https://samjia12.github.io",
  projectPath: "/SJ-playground-nomad-decision-wheel/",
  socialImagePath: "social-card.svg",
  playgroundUrl: "https://github.com/samjia12?tab=repositories",
  projectShareBlurb:
    "Nomad Decision Wheel is a ritual-grade fate machine for digital nomads, overthinkers, and beautifully unserious adults. It turns indecision into premium interface drama.",
  metaDescription:
    "A ritual-grade fate wheel for digital nomads, overthinkers, degen optimists, and beautifully unserious adults.",
});

function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}

export function getCanonicalUrl() {
  return new URL(ensureTrailingSlash(SITE_CONFIG.projectPath), SITE_CONFIG.siteOrigin).toString();
}

export function getSocialImageUrl() {
  return new URL(SITE_CONFIG.socialImagePath, getCanonicalUrl()).toString();
}

export function getProjectShareBaseUrl() {
  if (typeof window === "undefined") {
    return getCanonicalUrl();
  }

  if (window.location?.origin?.startsWith("http")) {
    return new URL(window.location.pathname, window.location.origin).toString();
  }

  return getCanonicalUrl();
}

export function getPlaygroundUrl() {
  return SITE_CONFIG.playgroundUrl;
}

export function applySiteConfigToDocument(doc = document) {
  if (!doc) return;

  const canonicalUrl = getCanonicalUrl();
  const socialImageUrl = getSocialImageUrl();

  const canonicalTag = doc.querySelector("#site-canonical");
  const descriptionTag = doc.querySelector("#site-description");
  const ogDescriptionTag = doc.querySelector("#site-og-description");
  const ogUrlTag = doc.querySelector("#site-og-url");
  const ogImageTag = doc.querySelector("#site-og-image");
  const twitterDescriptionTag = doc.querySelector("#site-twitter-description");
  const twitterImageTag = doc.querySelector("#site-twitter-image");

  if (canonicalTag) {
    canonicalTag.setAttribute("href", canonicalUrl);
  }

  if (descriptionTag) {
    descriptionTag.setAttribute("content", SITE_CONFIG.metaDescription);
  }

  if (ogDescriptionTag) {
    ogDescriptionTag.setAttribute("content", SITE_CONFIG.metaDescription);
  }

  if (ogUrlTag) {
    ogUrlTag.setAttribute("content", canonicalUrl);
  }

  if (ogImageTag) {
    ogImageTag.setAttribute("content", socialImageUrl);
  }

  if (twitterDescriptionTag) {
    twitterDescriptionTag.setAttribute("content", SITE_CONFIG.metaDescription);
  }

  if (twitterImageTag) {
    twitterImageTag.setAttribute("content", socialImageUrl);
  }
}
