import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressWriteAdditionalPorts(
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
    saveAcademicDiscipline: resolvePort<ApplicationPorts["saveAcademicDiscipline"]>(
      container,
      applicationDependencyTokens.saveAcademicDiscipline,
    ),
    deleteAcademicDiscipline: resolvePort<ApplicationPorts["deleteAcademicDiscipline"]>(
      container,
      applicationDependencyTokens.deleteAcademicDiscipline,
    ),
    saveFocusSession: resolvePort<ApplicationPorts["saveFocusSession"]>(
      container,
      applicationDependencyTokens.saveFocusSession,
    ),
    saveStudyGoal: resolvePort<ApplicationPorts["saveStudyGoal"]>(
      container,
      applicationDependencyTokens.saveStudyGoal,
    ),
    savePersonalWorkspace: resolvePort<ApplicationPorts["savePersonalWorkspace"]>(
      container,
      applicationDependencyTokens.savePersonalWorkspace,
    ),
  };
}
