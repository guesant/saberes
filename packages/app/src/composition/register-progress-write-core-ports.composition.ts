import {
  type ProgressStorageContract,
  ClearProgressAdapter,
  EnrollCourseAdapter,
  ImportProgressAdapter,
  RecordAttemptAdapter,
  SaveAttemptAdapter,
  SaveLessonProgressAdapter,
  SavePlanProgressAdapter,
  SaveSessionAdapter,
  SaveSettingAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { PortFactoryBinding } from "./port-factory-binding.type";
import type { Container } from "inversify";

export function createProgressWriteCorePortBindings(container: Container): void {
  const getProgressStore = (): ProgressStorageContract =>
    resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore);

  const bindings: PortFactoryBinding[] = [
    [applicationDependencyTokens.recordAttempt, () => new RecordAttemptAdapter(getProgressStore())],
    [applicationDependencyTokens.saveAttempt, () => new SaveAttemptAdapter(getProgressStore())],
    [applicationDependencyTokens.saveSession, () => new SaveSessionAdapter(getProgressStore())],
    [applicationDependencyTokens.saveSetting, () => new SaveSettingAdapter(getProgressStore())],
    [applicationDependencyTokens.clearProgress, () => new ClearProgressAdapter(getProgressStore())],
    [applicationDependencyTokens.enrollCourse, () => new EnrollCourseAdapter(getProgressStore())],
    [
      applicationDependencyTokens.importProgress,
      () => new ImportProgressAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.saveLessonProgress,
      () => new SaveLessonProgressAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.savePlanProgress,
      () => new SavePlanProgressAdapter(getProgressStore()),
    ],
  ];

  registerPortFactories(container, bindings);
}
