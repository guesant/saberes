import { resolveApplicationPort } from "./resolve-application-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressWriteSecondaryPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "saveAcademicDiscipline"
  | "deleteAcademicDiscipline"
  | "saveFocusSession"
  | "saveStudyGoal"
  | "savePersonalWorkspace"
> {
  return {
    saveAcademicDiscipline: resolveApplicationPort(container, "saveAcademicDiscipline"),
    deleteAcademicDiscipline: resolveApplicationPort(container, "deleteAcademicDiscipline"),
    saveFocusSession: resolveApplicationPort(container, "saveFocusSession"),
    saveStudyGoal: resolveApplicationPort(container, "saveStudyGoal"),
    savePersonalWorkspace: resolveApplicationPort(container, "savePersonalWorkspace"),
  };
}
