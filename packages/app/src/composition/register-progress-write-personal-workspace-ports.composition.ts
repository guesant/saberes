import {
  ArchiveStudyCaptureAdapter,
  ClassifyStudyCaptureAdapter,
  CompleteStudyCaptureAdapter,
  PostponeStudyCaptureAdapter,
  SavePersonalWorkspaceAdapter,
  RestoreStudyCaptureAdapter,
  UndoStudyCaptureAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { createProgressStorageAdapterFactory } from "./create-progress-storage-adapter-factory.composition";
import { registerPortFactories } from "./register-port-factories.composition";
import { registerProgressWriteCalendarEntryPort } from "./register-progress-write-calendar-entry-port.composition";
import { registerProgressWritePersonalRelationPorts } from "./register-progress-write-personal-relation-ports.composition";
import type { Container } from "inversify";

export function registerProgressWritePersonalWorkspacePorts(container: Container): void {
  registerPortFactories(container, [
    [
      applicationDependencyTokens.classifyStudyCapture,
      createProgressStorageAdapterFactory(container, ClassifyStudyCaptureAdapter),
    ],
    [
      applicationDependencyTokens.savePersonalWorkspace,
      createProgressStorageAdapterFactory(container, SavePersonalWorkspaceAdapter),
    ],
    [
      applicationDependencyTokens.completeStudyCapture,
      createProgressStorageAdapterFactory(container, CompleteStudyCaptureAdapter),
    ],
    [
      applicationDependencyTokens.postponeStudyCapture,
      createProgressStorageAdapterFactory(container, PostponeStudyCaptureAdapter),
    ],
    [
      applicationDependencyTokens.archiveStudyCapture,
      createProgressStorageAdapterFactory(container, ArchiveStudyCaptureAdapter),
    ],
    [
      applicationDependencyTokens.restoreStudyCapture,
      createProgressStorageAdapterFactory(container, RestoreStudyCaptureAdapter),
    ],
    [
      applicationDependencyTokens.undoStudyCapture,
      createProgressStorageAdapterFactory(container, UndoStudyCaptureAdapter),
    ],
  ]);

  registerProgressWriteCalendarEntryPort(container);

  registerProgressWritePersonalRelationPorts(container);
}
