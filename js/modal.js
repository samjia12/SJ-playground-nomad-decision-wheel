function getFocusableElements(container) {
  return [...container.querySelectorAll(
    'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )];
}

export function createModalController(elements) {
  let isOpen = false;
  let lastFocusedElement = null;
  let handlers = {
    onClose: () => {},
    onShare: () => {},
    onCopyLink: () => {},
    onSpinAgain: () => {},
  };

  function render({ outcome, historyEntry, accuracy, categoryMeta }) {
    const category = categoryMeta[outcome.category];
    elements.modalTitle.textContent = outcome.label;
    elements.modalCategory.textContent = category.name;
    elements.modalCategory.style.color = category.color;
    elements.modalCategory.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 999px rgba(255,255,255,0.02), 0 0 20px ${category.glow}`;
    elements.modalTime.textContent = historyEntry.displayTime;
    elements.modalLead.textContent = accuracy.detailLead;
    elements.modalInterpretation.textContent = outcome.interpretation;
    elements.modalShareFeedback.textContent = "";
  }

  function trapFocus(event) {
    if (!isOpen || event.key !== "Tab") return;
    const focusable = getFocusableElements(elements.modalPanel);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleKeydown(event) {
    if (!isOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close({ restoreFocus: true });
      handlers.onClose();
    }
    trapFocus(event);
  }

  function open(payload) {
    handlers = { ...handlers, ...payload.handlers };
    render(payload);
    isOpen = true;
    lastFocusedElement = document.activeElement;
    elements.modal.classList.remove("modal-hidden");
    elements.modal.classList.add("modal-visible");
    elements.modalPanel.classList.remove("animate-in");
    void elements.modalPanel.offsetWidth;
    elements.modalPanel.classList.add("animate-in");
    document.addEventListener("keydown", handleKeydown);

    requestAnimationFrame(() => {
      elements.closeModal.focus();
    });
  }

  function close({ restoreFocus = true } = {}) {
    if (!isOpen) return;
    isOpen = false;
    elements.modal.classList.remove("modal-visible");
    elements.modal.classList.add("modal-hidden");
    document.removeEventListener("keydown", handleKeydown);

    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  elements.closeModal.addEventListener("click", () => {
    close({ restoreFocus: true });
    handlers.onClose();
  });

  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      close({ restoreFocus: true });
      handlers.onClose();
    }
  });

  elements.modalShareButton.addEventListener("click", async () => {
    const message = await handlers.onShare();
    if (message) {
      elements.modalShareFeedback.textContent = message;
    }
  });

  elements.modalCopyLinkButton.addEventListener("click", async () => {
    const message = await handlers.onCopyLink();
    if (message) {
      elements.modalShareFeedback.textContent = message;
    }
  });

  elements.modalSpinAgainButton.addEventListener("click", async () => {
    close({ restoreFocus: false });
    handlers.onSpinAgain();
  });

  return {
    open,
    close,
    isOpen: () => isOpen,
  };
}
