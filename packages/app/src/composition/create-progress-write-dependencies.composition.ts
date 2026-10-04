import {
  DeleteAcademicDisciplineAdapter,
  SaveAcademicDisciplineAdapter,
  SaveFocusSessionAdapter,
  SaveStudyGoalAdapter,
  type ProgressStorageContract,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { createProgressWriteCorePortBindings } from "./register-progress-write-core-ports.composition";
import { registerProgressWritePersonalWorkspacePorts } from "./register-progress-write-personal-workspace-ports.composition";
import { createProgressWriteReviewPortBindings } from "./register-progress-write-review-ports.composition";
import { createProgressWriteSavedFilterPortBindings } from "./register-progress-write-saved-filter-ports.composition";
import { resolvePort } from "./resolve-port.composition";
import type { Container } from "inversify";

export function createProgressWriteDependencies(container: Container): void {
  createProgressWriteCorePortBindings(container);

  createProgressWriteReviewPortBindings(container);

  createProgressWriteSavedFilterPortBindings(container);

  registerProgressWritePersonalWorkspacePorts(container);

  const getProgressStore = (): ProgressStorageContract =>
    resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore);

  registerPortFactories(container, [
    [
      applicationDependencyTokens.saveAcademicDiscipline,
      () => new SaveAcademicDisciplineAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.deleteAcademicDiscipline,
      () => new DeleteAcademicDisciplineAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.saveFocusSession,
      () => new SaveFocusSessionAdapter(getProgressStore()),
    ],
    [applicationDependencyTokens.saveStudyGoal, () => new SaveStudyGoalAdapter(getProgressStore())],
  ]);
}
