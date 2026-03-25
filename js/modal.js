function getFocusableElements(container) {
  return [
    ...container.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ),
  ];
}

function createDialogController({ root, panel, closeButton }) {
  let isOpen = false;
  let lastFocusedElement = null;

  function trapFocus(event) {
    if (!isOpen || event.key !== "Tab") return;
    const focusable = getFocusableElements(panel);
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
      api.close({ restoreFocus: true });
      root.dispatchEvent(new CustomEvent("dialogclose"));
      return;
    }

    trapFocus(event);
  }

  closeButton.addEventListener("click", () => {
    api.close({ restoreFocus: true });
    root.dispatchEvent(new CustomEvent("dialogclose"));
  });

  root.addEventListener("click", (event) => {
    if (event.target === root) {
      api.close({ restoreFocus: true });
      root.dispatchEvent(new CustomEvent("dialogclose"));
    }
  });

  const api = {
    open({ initialFocus = closeButton } = {}) {
      isOpen = true;
      lastFocusedElement = document.activeElement;
      root.classList.remove("modal-hidden");
      root.classList.add("modal-visible");
      panel.classList.remove("animate-in");
      void panel.offsetWidth;
      panel.classList.add("animate-in");
      document.addEventListener("keydown", handleKeydown);

      requestAnimationFrame(() => {
        initialFocus.focus();
      });
    },
    close({ restoreFocus = true } = {}) {
      if (!isOpen) return;
      isOpen = false;
      root.classList.remove("modal-visible");
      root.classList.add("modal-hidden");
      document.removeEventListener("keydown", handleKeydown);

      if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }
    },
    isOpen: () => isOpen,
  };

  return api;
}

export function createModalController(elements) {
  const dialog = createDialogController({
    root: elements.modal,
    panel: elements.modalPanel,
    closeButton: elements.closeModal,
  });

  let handlers = {
    onClose: () => {},
    onShare: () => {},
    onCopyLink: () => {},
    onSpinAgain: () => {},
  };

  function render({ outcome, historyEntry, accuracy, categoryMeta }) {
    const category = categoryMeta[outcome.category];
    elements.modalTitle.textContent = outcome.title;
    elements.modalCategory.textContent = category.name;
    elements.modalCategory.style.color = category.color;
    elements.modalCategory.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.12), inset 0 0 0 999px rgba(255,255,255,0.02), 0 0 20px ${category.glow}`;
    elements.modalTime.textContent = historyEntry.displayTime;
    elements.modalLead.textContent = accuracy.detailLead;
    elements.modalInterpretation.textContent = outcome.detail;
    elements.modalShareFeedback.textContent = "";
  }

  elements.modal.addEventListener("dialogclose", () => {
    handlers.onClose();
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
    dialog.close({ restoreFocus: false });
    handlers.onSpinAgain();
  });

  return {
    open(payload) {
      handlers = { ...handlers, ...payload.handlers };
      render(payload);
      dialog.open();
    },
    close(options) {
      dialog.close(options);
    },
    isOpen: dialog.isOpen,
  };
}

export function createBrowserController(elements) {
  const dialog = createDialogController({
    root: elements.browserModal,
    panel: elements.browserPanel,
    closeButton: elements.closeBrowser,
  });

  elements.browserModal.addEventListener("dialogclose", () => {
    dialog.close({ restoreFocus: true });
  });

  return dialog;
}
