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
  const getProgressStore = (): ProgressStorageContract => { return resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore); };

  const bindings: PortFactoryBinding[] = [
    [applicationDependencyTokens.recordAttempt, () => { return new RecordAttemptAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveAttempt, () => { return new SaveAttemptAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveSession, () => { return new SaveSessionAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveSetting, () => { return new SaveSettingAdapter(getProgressStore()); }],
    [applicationDependencyTokens.clearProgress, () => { return new ClearProgressAdapter(getProgressStore()); }],
    [applicationDependencyTokens.enrollCourse, () => { return new EnrollCourseAdapter(getProgressStore()); }],
    [applicationDependencyTokens.importProgress, () => { return new ImportProgressAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveLessonProgress, () => { return new SaveLessonProgressAdapter(getProgressStore()); }],
    [applicationDependencyTokens.savePlanProgress, () => { return new SavePlanProgressAdapter(getProgressStore()); }],
  ];

  registerPortFactories(container, bindings);
}
