export function findRenderedUiGrid(): HTMLElement | undefined {
  for (const element of Array.from(document.querySelectorAll<HTMLElement>(".MuiBox-root"))) {
    if (window.getComputedStyle(element).display === "grid" && element.children.length > 1) {
      return element;
    }
  }

  return undefined;
}
