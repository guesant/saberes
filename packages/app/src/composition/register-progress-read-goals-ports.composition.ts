import {
  ListStudyGoalsAdapter,
  type ProgressStorageContract,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { Container } from "inversify";

export function registerProgressReadGoalsPorts(container: Container): void {
  registerPortFactories(container, [
    [
      applicationDependencyTokens.listStudyGoals,
      () =>
        new ListStudyGoalsAdapter(
          resolvePort<ProgressStorageContract>(
            container,
            applicationDependencyTokens.progressStore,
          ),
        ),
    ],
  ]);
}
