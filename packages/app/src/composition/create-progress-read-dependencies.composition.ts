import {
  DexieProgressStore,
  ProgressDatabase,
  type ProgressDatabaseContract,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPort } from "./register-port.composition";
import { createProgressReadAttemptPortBindings } from "./register-progress-read-attempt-ports.composition";
import { createProgressReadReviewPortBindings } from "./register-progress-read-review-ports.composition";
import { resolvePort } from "./resolve-port.composition";
import type { Container } from "inversify";

export function createProgressReadDependencies(container: Container): void {
  registerPort(
    container,
    applicationDependencyTokens.progressDatabase,
    () => new ProgressDatabase(),
  );

  registerPort(
    container,
    applicationDependencyTokens.progressStore,
    () =>
      new DexieProgressStore(
        resolvePort<ProgressDatabaseContract>(
          container,
          applicationDependencyTokens.progressDatabase,
        ),
      ),
  );

  createProgressReadAttemptPortBindings(container);

  createProgressReadReviewPortBindings(container);
}
