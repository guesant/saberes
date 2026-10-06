import type { MouseEvent } from "react";

export function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  const modifierKeys = [event.metaKey, event.ctrlKey, event.shiftKey, event.altKey];

  return event.defaultPrevented || event.button !== 0 || modifierKeys.some(Boolean);
}
