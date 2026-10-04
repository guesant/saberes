import { createProgressWriteCorePortBindings } from "./register-progress-write-core-ports.composition";
import { createProgressWriteReviewPortBindings } from "./register-progress-write-review-ports.composition";
import { createProgressWriteSavedFilterPortBindings } from "./register-progress-write-saved-filter-ports.composition";
import type { Container } from "inversify";

export function createProgressWriteDependencies(container: Container): void {
  createProgressWriteCorePortBindings(container);

  createProgressWriteReviewPortBindings(container);

  createProgressWriteSavedFilterPortBindings(container);
}
