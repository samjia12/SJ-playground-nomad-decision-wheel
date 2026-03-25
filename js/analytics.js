export function dispatchNDWEvent(name, detail = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(name, {
      detail: {
        timestamp: new Date().toISOString(),
        ...detail,
      },
    })
  );
}
