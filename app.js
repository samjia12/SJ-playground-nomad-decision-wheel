const data = window.NOMAD_WHEEL_DATA;
const CATEGORY_META = data?.CATEGORY_META ?? {};
const OUTCOMES = data?.OUTCOMES ?? [];

const STORAGE_KEY = "nomad-decision-wheel-history";
const HISTORY_LIMIT = 15;
const SEGMENT_COUNT = OUTCOMES.length;
const SEGMENT_ANGLE = SEGMENT_COUNT ? 360 / SEGMENT_COUNT : 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  status: "booting",
  currentRotation: 0,
  selectedOutcome: null,
  history: [],
  lastFocusedElement: null,
  modalTimer: null,
  lastOutcomeId: null,
};

let elements = {};

function polarToCartesian(radius, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(angleRad) * radius,
    y: Math.sin(angleRad) * radius,
  };
}

function queryElements() {
  return {
    wheelSegments: document.querySelector("#wheel-segments"),
    wheelShell: document.querySelector("#wheel-shell"),
    spinButton: document.querySelector("#spin-button"),
    wheelStatus: document.querySelector("#wheel-status"),
    resultTeaser: document.querySelector("#result-teaser"),
    resultTeaserDot: document.querySelector("#result-teaser-dot"),
    resultTeaserCategory: document.querySelector("#result-teaser-category"),
    resultTeaserLabel: document.querySelector("#result-teaser-label"),
    resultTeaserCopy: document.querySelector("#result-teaser-copy"),
    historyList: document.querySelector("#history-list"),
    clearHistory: document.querySelector("#clear-history"),
    emptyTemplate: document.querySelector("#history-empty-template"),
    categoryLegend: document.querySelector("#category-legend"),
    modal: document.querySelector("#result-modal"),
    modalPanel: document.querySelector("#result-modal .glass-panel"),
    closeModal: document.querySelector("#close-modal"),
    modalTitle: document.querySelector("#modal-title"),
    modalCategory: document.querySelector("#modal-category"),
    modalTime: document.querySelector("#modal-time"),
    modalInterpretation: document.querySelector("#modal-interpretation"),
    spinAgain: document.querySelector("#spin-again"),
    shareFate: document.querySelector("#share-fate"),
    shareFeedback: document.querySelector("#share-feedback"),
    shareProject: document.querySelector("#share-project"),
    projectShareFeedback: document.querySelector("#project-share-feedback"),
    socialSnippets: document.querySelector("#social-snippets"),
  };
}

function validateSetup() {
  const requiredElements = [
    "wheelSegments",
    "wheelShell",
    "spinButton",
    "wheelStatus",
    "historyList",
    "clearHistory",
    "emptyTemplate",
    "categoryLegend",
    "modal",
    "modalPanel",
    "closeModal",
    "modalTitle",
    "modalCategory",
    "modalTime",
    "modalInterpretation",
    "spinAgain",
    "shareFate",
    "shareFeedback",
    "socialSnippets",
  ];

  if (!OUTCOMES.length || !Object.keys(CATEGORY_META).length) {
    throw new Error("Nomad Decision Wheel data failed to load.");
  }

  const missing = requiredElements.filter((key) => !elements[key]);
  if (missing.length) {
    throw new Error(`Nomad Decision Wheel is missing required UI elements: ${missing.join(", ")}`);
  }
}

function setWheelStatus(message, tone = "neutral") {
  if (!elements.wheelStatus) return;
  elements.wheelStatus.textContent = message;
  const toneColorMap = {
    neutral: "#D6C2A1",
    active: "#14F195",
    warning: "#FF8A65",
  };
  elements.wheelStatus.style.color = toneColorMap[tone] ?? toneColorMap.neutral;
}

function updateResultTeaser(outcome) {
  if (!elements.resultTeaser || !outcome) return;

  const category = CATEGORY_META[outcome.category];
  elements.resultTeaser.classList.remove("hidden");
  elements.resultTeaserDot.style.background = category.color;
  elements.resultTeaserDot.style.boxShadow = `0 0 18px ${category.glow}`;
  elements.resultTeaserCategory.textContent = category.name;
  elements.resultTeaserLabel.textContent = outcome.label;
  elements.resultTeaserCopy.textContent = outcome.interpretation;
}

function hideResultTeaser() {
  if (!elements.resultTeaser) return;
  elements.resultTeaser.classList.add("hidden");
}

function createArcPath(innerRadius, outerRadius, startAngle, endAngle) {
  const startOuter = polarToCartesian(outerRadius, startAngle);
  const endOuter = polarToCartesian(outerRadius, endAngle);
  const startInner = polarToCartesian(innerRadius, endAngle);
  const endInner = polarToCartesian(innerRadius, startAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

  return [
    `M ${startOuter.x.toFixed(3)} ${startOuter.y.toFixed(3)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x.toFixed(3)} ${endOuter.y.toFixed(3)}`,
    `L ${startInner.x.toFixed(3)} ${startInner.y.toFixed(3)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${endInner.x.toFixed(3)} ${endInner.y.toFixed(3)}`,
    "Z",
  ].join(" ");
}

function adjustColor(hex, amount) {
  const normalized = hex.replace("#", "");
  const numeric = parseInt(normalized, 16);
  const clamp = (value) => Math.max(0, Math.min(255, value));
  const r = clamp((numeric >> 16) + amount);
  const g = clamp(((numeric >> 8) & 0xff) + amount);
  const b = clamp((numeric & 0xff) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function formatTimestamp(date) {
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

function renderLegend() {
  elements.categoryLegend.innerHTML = "";

  Object.values(CATEGORY_META).forEach((category) => {
    const item = document.createElement("div");
    item.className =
      "flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3";
    item.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="h-3 w-3 rounded-full" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
        <span class="text-sm text-slate-200">${category.name}</span>
      </div>
      <span class="text-[11px] uppercase tracking-[0.18em] text-slate-500">${OUTCOMES.filter((item) => item.category === category.key).length}</span>
    `;
    elements.categoryLegend.appendChild(item);
  });
}

function renderSocialSnippets() {
  if (!elements.socialSnippets) return;

  const selections = [
    OUTCOMES[0],
    OUTCOMES[11],
    OUTCOMES[30],
  ];

  elements.socialSnippets.innerHTML = "";

  selections.forEach((outcome) => {
    const category = CATEGORY_META[outcome.category];
    const card = document.createElement("article");
    card.className = "social-card rounded-[28px] p-5";
    card.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="h-3 w-3 rounded-full" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
        <span class="text-[11px] uppercase tracking-[0.22em] text-slate-500">${category.name}</span>
      </div>
      <p class="mt-4 text-lg font-semibold leading-7 text-white">"${outcome.label}"</p>
      <p class="mt-4 font-mono text-sm leading-7 text-slate-300">${outcome.shareText}</p>
    `;
    elements.socialSnippets.appendChild(card);
  });
}

function renderWheel() {
  if (!elements.wheelSegments) return;

  const fragment = document.createDocumentFragment();
  const innerRadius = 136;
  const outerRadius = 332;
  const labelRadius = 250;

  OUTCOMES.forEach((outcome, index) => {
    const category = CATEGORY_META[outcome.category];
    const startAngle = -90 - SEGMENT_ANGLE / 2 - index * SEGMENT_ANGLE;
    const endAngle = startAngle - SEGMENT_ANGLE;
    const centerAngle = startAngle - SEGMENT_ANGLE / 2;
    const fill = adjustColor(category.color, index % 2 === 0 ? 0 : -20);

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const segment = document.createElementNS("http://www.w3.org/2000/svg", "path");
    segment.setAttribute("d", createArcPath(innerRadius, outerRadius, startAngle, endAngle));
    segment.setAttribute("fill", fill);
    segment.setAttribute("fill-opacity", index % 3 === 0 ? "0.96" : "0.88");
    segment.setAttribute("stroke", "rgba(255,255,255,0.13)");
    segment.setAttribute("stroke-width", "1");

    const separator = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const separatorStart = polarToCartesian(innerRadius, startAngle);
    const separatorEnd = polarToCartesian(outerRadius, startAngle);
    separator.setAttribute("x1", separatorStart.x.toFixed(3));
    separator.setAttribute("y1", separatorStart.y.toFixed(3));
    separator.setAttribute("x2", separatorEnd.x.toFixed(3));
    separator.setAttribute("y2", separatorEnd.y.toFixed(3));
    separator.setAttribute("stroke", "rgba(255,255,255,0.12)");
    separator.setAttribute("stroke-width", "1");

    const labelPosition = polarToCartesian(labelRadius, centerAngle);
    const uprightAngle = centerAngle < -90 && centerAngle > -270 ? centerAngle + 180 : centerAngle;
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("class", "wheel-text");
    text.setAttribute(
      "transform",
      `translate(${labelPosition.x.toFixed(3)} ${labelPosition.y.toFixed(3)}) rotate(${uprightAngle})`
    );
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");

    const lineOne = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    lineOne.setAttribute("x", "0");
    lineOne.setAttribute("dy", "-0.25em");
    lineOne.textContent = String(outcome.id).padStart(2, "0");

    const lineTwo = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    lineTwo.setAttribute("x", "0");
    lineTwo.setAttribute("dy", "1.25em");
    lineTwo.textContent = outcome.shortLabel.toUpperCase();

    text.append(lineOne, lineTwo);
    group.append(segment, separator, text);
    fragment.appendChild(group);
  });

  const finalSeparator = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const finalStartAngle = -90 - SEGMENT_ANGLE / 2 - SEGMENT_COUNT * SEGMENT_ANGLE;
  const finalStart = polarToCartesian(innerRadius, finalStartAngle);
  const finalEnd = polarToCartesian(outerRadius, finalStartAngle);
  finalSeparator.setAttribute("x1", finalStart.x.toFixed(3));
  finalSeparator.setAttribute("y1", finalStart.y.toFixed(3));
  finalSeparator.setAttribute("x2", finalEnd.x.toFixed(3));
  finalSeparator.setAttribute("y2", finalEnd.y.toFixed(3));
  finalSeparator.setAttribute("stroke", "rgba(255,255,255,0.14)");
  finalSeparator.setAttribute("stroke-width", "1");

  elements.wheelSegments.innerHTML = "";
  elements.wheelSegments.appendChild(fragment);
  elements.wheelSegments.appendChild(finalSeparator);
  applyWheelRotation(state.currentRotation);
}

function getStoredHistory() {
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

function persistHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history.slice(0, HISTORY_LIMIT)));
}

function renderHistory(newEntryId = null) {
  elements.historyList.innerHTML = "";

  if (!state.history.length) {
    elements.historyList.appendChild(elements.emptyTemplate.content.cloneNode(true));
    return;
  }

  state.history.forEach((entry) => {
    const item = document.createElement("article");
    const category = CATEGORY_META[entry.category];
    item.className = `history-item rounded-[22px] px-4 py-4 ${entry.id === newEntryId ? "is-new" : ""}`;

    item.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 gap-3">
          <span class="mt-1.5 h-2.5 w-2.5 flex-none rounded-full" style="background:${category.color}; box-shadow: 0 0 18px ${category.glow};"></span>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-white">${entry.label}</p>
            <p class="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">${category.name}</p>
          </div>
        </div>
        <time class="text-xs text-slate-500" datetime="${entry.isoTime}">${entry.displayTime}</time>
      </div>
    `;

    elements.historyList.appendChild(item);
  });
}

function applyWheelRotation(angle) {
  elements.wheelShell.style.transform = `rotate(${angle}deg)`;
}

function easeOutQuint(progress) {
  return 1 - Math.pow(1 - progress, 5);
}

function animateRotation(targetRotation, duration) {
  const startRotation = state.currentRotation;
  const delta = targetRotation - startRotation;
  let rafId = null;

  return new Promise((resolve) => {
    const startTime = performance.now();

    const frame = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = prefersReducedMotion.matches ? progress : easeOutQuint(progress);
      state.currentRotation = startRotation + delta * eased;
      applyWheelRotation(state.currentRotation);

      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        state.currentRotation = targetRotation;
        applyWheelRotation(state.currentRotation);
        if (rafId) cancelAnimationFrame(rafId);
        resolve();
      }
    };

    requestAnimationFrame(frame);
  });
}

function createHistoryEntry(outcome) {
  const timestamp = new Date();
  return {
    id:
      window.crypto?.randomUUID?.() ??
      `spin-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    outcomeId: outcome.id,
    label: outcome.label,
    category: outcome.category,
    isoTime: timestamp.toISOString(),
    displayTime: formatTimestamp(timestamp),
  };
}

function getRandomOutcomeIndex() {
  if (OUTCOMES.length <= 1) return 0;

  let nextIndex = Math.floor(Math.random() * OUTCOMES.length);
  let safety = 0;
  while (OUTCOMES[nextIndex]?.id === state.lastOutcomeId && safety < 12) {
    nextIndex = Math.floor(Math.random() * OUTCOMES.length);
    safety += 1;
  }
  return nextIndex;
}

function getTargetRotation(index) {
  const currentNormalized = ((state.currentRotation % 360) + 360) % 360;
  const targetNormalized = index * SEGMENT_ANGLE;
  const deltaToTarget = (targetNormalized - currentNormalized + 360) % 360;
  const extraTurns = (prefersReducedMotion.matches ? 2 : 8) * 360;
  const jitter = prefersReducedMotion.matches ? 0 : Math.random() * (SEGMENT_ANGLE * 0.18);
  return state.currentRotation + extraTurns + deltaToTarget + jitter;
}

function setButtonsDisabled(isDisabled) {
  elements.spinButton.disabled = isDisabled;
  elements.spinButton.textContent = isDisabled ? "Spinning" : "Spin";
  elements.spinButton.classList.toggle("is-spinning", isDisabled);
}

function resetShareFeedback() {
  elements.shareFeedback.textContent = "";
}

function resetProjectShareFeedback() {
  if (elements.projectShareFeedback) {
    elements.projectShareFeedback.textContent = "";
  }
}

async function shareText({ title, text, feedbackElement, successMessage }) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      feedbackElement.textContent = successMessage;
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      feedbackElement.textContent = "Copied to clipboard. Chaos now scales peer-to-peer.";
      return;
    }

    feedbackElement.textContent = text;
  } catch (error) {
    console.warn("Sharing failed", error);
    feedbackElement.textContent = "Sharing failed gracefully. The omen remains local.";
  }
}

function openModal(outcome, historyEntry) {
  state.lastFocusedElement = document.activeElement;
  state.selectedOutcome = outcome;
  resetShareFeedback();

  const category = CATEGORY_META[outcome.category];
  elements.modalTitle.textContent = outcome.label;
  elements.modalCategory.textContent = category.name;
  elements.modalCategory.style.color = category.color;
  elements.modalCategory.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 999px rgba(255,255,255,0.02), 0 0 20px ${category.glow}`;
  elements.modalTime.textContent = historyEntry.displayTime;
  elements.modalInterpretation.textContent = outcome.interpretation;

  elements.modal.classList.remove("modal-hidden");
  elements.modal.classList.add("modal-visible");
  elements.modalPanel.classList.remove("animate-modal-in");
  void elements.modalPanel.offsetWidth;
  elements.modalPanel.classList.add("animate-modal-in");

  requestAnimationFrame(() => {
    elements.closeModal.focus();
  });
}

function closeModal({ focusSpin = false, restoreFocus = true } = {}) {
  elements.modal.classList.remove("modal-visible");
  elements.modal.classList.add("modal-hidden");

  if (focusSpin) {
    elements.spinButton.focus();
  } else if (restoreFocus && state.lastFocusedElement instanceof HTMLElement) {
    state.lastFocusedElement.focus();
  }
}

async function handleSpin() {
  if (state.status === "spinning") return;

  try {
    closeModal({ restoreFocus: false });
    state.status = "spinning";
    setButtonsDisabled(true);
    setWheelStatus("Wheel spinning. Your certainty is being professionally destabilized.", "active");

    const selectedIndex = getRandomOutcomeIndex();
    const targetRotation = getTargetRotation(selectedIndex);
    const duration = prefersReducedMotion.matches
      ? 1200
      : 4800 + Math.floor(Math.random() * 1500);

    await animateRotation(targetRotation, duration);

    const outcome = OUTCOMES[selectedIndex];
    state.lastOutcomeId = outcome.id;

    const historyEntry = createHistoryEntry(outcome);
    state.history = [historyEntry, ...state.history].slice(0, HISTORY_LIMIT);
    persistHistory();
    renderHistory(historyEntry.id);
    updateResultTeaser(outcome);

    state.status = "revealed";
    setButtonsDisabled(false);
    setWheelStatus(`Fate landed on: ${outcome.label}`, "neutral");

    window.clearTimeout(state.modalTimer);
    state.modalTimer = window.setTimeout(() => {
      openModal(outcome, historyEntry);
    }, prefersReducedMotion.matches ? 0 : 280);
  } catch (error) {
    console.error(error);
    state.status = "idle";
    setButtonsDisabled(false);
    setWheelStatus("The wheel glitched. Tap spin again and pretend it was part of the mystique.", "warning");
  }
}

async function handleShare() {
  if (!state.selectedOutcome) return;
  await shareText({
    title: "Nomad Decision Wheel",
    text: state.selectedOutcome.shareText,
    feedbackElement: elements.shareFeedback,
    successMessage: "Fate shared. Accountability remains non-transferable.",
  });
}

async function handleProjectShare() {
  if (!elements.projectShareFeedback) return;

  resetProjectShareFeedback();

  const promoText =
    "I found Nomad Decision Wheel, a cyber-chic fate roulette for digital nomads and other beautifully unserious adults. Spin the wheel. Outsource your life choices.";

  await shareText({
    title: "Nomad Decision Wheel",
    text: promoText,
    feedbackElement: elements.projectShareFeedback,
    successMessage: "Project link launched into the group chat. You have done enough.",
  });
}

function handleClearHistory() {
  state.history = [];
  persistHistory();
  renderHistory();
  hideResultTeaser();
  setWheelStatus("History cleared. The wheel forgives you faster than you forgive yourself.", "neutral");
}

function handleKeydown(event) {
  if (event.key === "Escape" && elements.modal.classList.contains("modal-visible")) {
    closeModal({ focusSpin: state.status !== "spinning" });
  }
}

function bindEvents() {
  elements.spinButton.addEventListener("click", handleSpin);
  elements.spinButton.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && state.status !== "spinning") {
      event.preventDefault();
      handleSpin();
    }
  });
  elements.spinAgain.addEventListener("click", async () => {
    closeModal({ focusSpin: false });
    await handleSpin();
  });
  elements.shareFate.addEventListener("click", handleShare);
  if (elements.shareProject) {
    elements.shareProject.addEventListener("click", handleProjectShare);
  }
  elements.clearHistory.addEventListener("click", handleClearHistory);
  elements.closeModal.addEventListener("click", () => closeModal({ focusSpin: true }));
  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      closeModal({ focusSpin: true });
    }
  });
  document.addEventListener("keydown", handleKeydown);
  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", () => {
      applyWheelRotation(state.currentRotation);
    });
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(() => {
      applyWheelRotation(state.currentRotation);
    });
  }
}

function init() {
  try {
    elements = queryElements();
    validateSetup();
    state.history = getStoredHistory();
    state.status = "idle";
    renderLegend();
    renderSocialSnippets();
    renderWheel();
    renderHistory();
    bindEvents();
    setButtonsDisabled(false);
    const latestHistoryItem = state.history[0];
    if (latestHistoryItem) {
      const latestOutcome = OUTCOMES.find((item) => item.id === latestHistoryItem.outcomeId);
      if (latestOutcome) {
        updateResultTeaser(latestOutcome);
        state.lastOutcomeId = latestOutcome.id;
        setWheelStatus(`Last recorded fate: ${latestOutcome.label}`, "neutral");
        return;
      }
    }
    setWheelStatus("Wheel armed. Fate is waiting for a volunteer.", "neutral");
  } catch (error) {
    console.error(error);
    elements = queryElements();
    if (elements.spinButton) {
      elements.spinButton.disabled = true;
      elements.spinButton.textContent = "Offline";
    }
    if (elements.wheelStatus) {
      setWheelStatus("Initialization failed. Refresh once; if it still breaks, the ritual stack is compromised.", "warning");
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
