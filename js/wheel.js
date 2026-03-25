function polarToCartesian(radius, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(angleRad) * radius,
    y: Math.sin(angleRad) * radius,
  };
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
  const numeric = parseInt(hex.replace("#", ""), 16);
  const clamp = (value) => Math.max(0, Math.min(255, value));
  const r = clamp((numeric >> 16) + amount);
  const g = clamp(((numeric >> 8) & 0xff) + amount);
  const b = clamp((numeric & 0xff) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

export function renderWheel({
  container,
  outcomes,
  categoryMeta,
  selectedOutcomeId = null,
  emptyLabel = "Restore filters to reload the wheel.",
}) {
  container.innerHTML = "";

  if (!outcomes.length) {
    const emptyGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const emptyOuter = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    emptyOuter.setAttribute("r", "332");
    emptyOuter.setAttribute("fill", "rgba(255,255,255,0.02)");
    emptyOuter.setAttribute("stroke", "rgba(255,255,255,0.12)");
    emptyOuter.setAttribute("stroke-width", "2");

    const emptyInner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    emptyInner.setAttribute("r", "130");
    emptyInner.setAttribute("fill", "rgba(11,10,17,0.9)");
    emptyInner.setAttribute("stroke", "rgba(255,255,255,0.12)");
    emptyInner.setAttribute("stroke-width", "3");

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", "wheel-text");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "middle");
    label.setAttribute("font-size", "16");
    label.textContent = emptyLabel;

    emptyGroup.append(emptyOuter, emptyInner, label);
    container.appendChild(emptyGroup);
    return;
  }

  const fragment = document.createDocumentFragment();
  const outcomeCount = outcomes.length;
  const segmentAngle = 360 / outcomeCount;
  const innerRadius = 140;
  const outerRadius = 332;
  const labelRadius = outcomeCount <= 6 ? 236 : outcomeCount > 36 ? 264 : 252;
  const labelSize = outcomeCount > 40 ? "11.5" : outcomeCount > 24 ? "12.5" : "13";

  function getDisplayWheelLabel(outcome) {
    return String(outcome.wheelLabel ?? outcome.shortLabel ?? outcome.title)
      .toUpperCase()
      .slice(0, outcomeCount > 40 ? 12 : 15);
  }

  outcomes.forEach((outcome, index) => {
    const category = categoryMeta[outcome.category];
    const startAngle = -90 - segmentAngle / 2 - index * segmentAngle;
    const endAngle = startAngle - segmentAngle;
    const centerAngle = startAngle - segmentAngle / 2;
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const fill = adjustColor(category.color, index % 2 === 0 ? -6 : -22);

    const segment = document.createElementNS("http://www.w3.org/2000/svg", "path");
    segment.setAttribute("d", createArcPath(innerRadius, outerRadius, startAngle, endAngle));
    segment.setAttribute("fill", fill);
    segment.setAttribute("fill-opacity", outcome.id === selectedOutcomeId ? "1" : "0.84");
    segment.setAttribute(
      "stroke",
      outcome.id === selectedOutcomeId ? "rgba(244,208,122,0.94)" : "rgba(255,255,255,0.28)"
    );
    segment.setAttribute("stroke-width", outcome.id === selectedOutcomeId ? "3.5" : "1.5");

    const separator = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const separatorStart = polarToCartesian(innerRadius, startAngle);
    const separatorEnd = polarToCartesian(outerRadius, startAngle);
    separator.setAttribute("x1", separatorStart.x.toFixed(3));
    separator.setAttribute("y1", separatorStart.y.toFixed(3));
    separator.setAttribute("x2", separatorEnd.x.toFixed(3));
    separator.setAttribute("y2", separatorEnd.y.toFixed(3));
    separator.setAttribute("stroke", "rgba(255,255,255,0.18)");
    separator.setAttribute("stroke-width", "1.1");

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
    text.setAttribute(
      "fill",
      outcome.id === selectedOutcomeId ? "rgba(255,248,233,1)" : "rgba(245,242,255,0.94)"
    );
    text.setAttribute("font-size", labelSize);

    const lineOne = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    lineOne.setAttribute("x", "0");
    lineOne.setAttribute("dy", "-0.25em");
    lineOne.textContent = String(outcome.id).padStart(2, "0");

    const lineTwo = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    lineTwo.setAttribute("x", "0");
    lineTwo.setAttribute("dy", "1.25em");
    lineTwo.textContent = getDisplayWheelLabel(outcome);

    text.append(lineOne, lineTwo);
    group.append(segment, separator, text);
    fragment.appendChild(group);
  });

  const finalSeparator = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const finalStartAngle = -90 - segmentAngle / 2 - outcomeCount * segmentAngle;
  const finalStart = polarToCartesian(innerRadius, finalStartAngle);
  const finalEnd = polarToCartesian(outerRadius, finalStartAngle);
  finalSeparator.setAttribute("x1", finalStart.x.toFixed(3));
  finalSeparator.setAttribute("y1", finalStart.y.toFixed(3));
  finalSeparator.setAttribute("x2", finalEnd.x.toFixed(3));
  finalSeparator.setAttribute("y2", finalEnd.y.toFixed(3));
  finalSeparator.setAttribute("stroke", "rgba(255,255,255,0.18)");
  finalSeparator.setAttribute("stroke-width", "1.1");

  container.append(fragment, finalSeparator);
}

export function applyWheelRotation(shell, angle) {
  shell.style.transform = `rotate(${angle}deg)`;
}

function easeOutQuint(progress) {
  return 1 - Math.pow(1 - progress, 5);
}

function randomInRange([min, max]) {
  return Math.round(min + Math.random() * (max - min));
}

export function getTargetRotation({
  currentRotation,
  targetIndex,
  outcomeCount,
  accuracy,
  reducedMotion,
}) {
  const currentNormalized = ((currentRotation % 360) + 360) % 360;
  const targetNormalized = targetIndex * (360 / outcomeCount);
  const deltaToTarget = (targetNormalized - currentNormalized + 360) % 360;
  const spinTurns = reducedMotion ? 2 : randomInRange(accuracy.turns) * 360;
  const jitter = reducedMotion ? 0 : Math.random() * ((360 / outcomeCount) * 0.18);

  return currentRotation + spinTurns + deltaToTarget + jitter;
}

export function getSpinDuration({ accuracy, reducedMotion }) {
  return reducedMotion ? 1200 : randomInRange(accuracy.duration);
}

export function spinWheel({
  shell,
  currentRotation,
  targetRotation,
  duration,
  reducedMotion,
}) {
  const startRotation = currentRotation;
  const delta = targetRotation - startRotation;

  return new Promise((resolve) => {
    const startTime = performance.now();

    const frame = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = reducedMotion ? progress : easeOutQuint(progress);
      const rotation = startRotation + delta * eased;
      applyWheelRotation(shell, rotation);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        applyWheelRotation(shell, targetRotation);
        resolve(targetRotation);
      }
    };

    requestAnimationFrame(frame);
  });
}
