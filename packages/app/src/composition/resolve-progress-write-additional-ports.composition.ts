import { resolveApplicationPort } from "./resolve-application-port.composition";
import { resolveProgressWritePersonalCapturePorts } from "./resolve-progress-write-personal-capture-ports.composition";
import { resolveProgressWriteSecondaryPorts } from "./resolve-progress-write-secondary-ports.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressWriteAdditionalPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "classifyStudyCapture"
  | "completeStudyCapture"
  | "postponeStudyCapture"
  | "archiveStudyCapture"
  | "restoreStudyCapture"
  | "undoStudyCapture"
  | "createCalendarEntry"
  | "saveAcademicDiscipline"
  | "deleteAcademicDiscipline"
  | "saveFocusSession"
  | "saveStudyGoal"
  | "savePersonalWorkspace"
> {
  return {
    ...resolveProgressWritePersonalCapturePorts(container),
    createCalendarEntry: resolveApplicationPort(container, "createCalendarEntry"),
    ...resolveProgressWriteSecondaryPorts(container),
  };
}
