import type { KeyboardEvent } from "react";

export function handleCardActionKeydown(event: KeyboardEvent<HTMLDivElement>): void {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();

  event.currentTarget.click();
}
