import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressReadAdditionalPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  "listAcademicDisciplines" | "listFocusSessions" | "listStudyGoals" | "getPersonalWorkspace"
> {
  return {
    listAcademicDisciplines: resolvePort<ApplicationPorts["listAcademicDisciplines"]>(
      container,
      applicationDependencyTokens.listAcademicDisciplines,
    ),
    listFocusSessions: resolvePort<ApplicationPorts["listFocusSessions"]>(
      container,
      applicationDependencyTokens.listFocusSessions,
    ),
    listStudyGoals: resolvePort<ApplicationPorts["listStudyGoals"]>(
      container,
      applicationDependencyTokens.listStudyGoals,
    ),
    getPersonalWorkspace: resolvePort<ApplicationPorts["getPersonalWorkspace"]>(
      container,
      applicationDependencyTokens.getPersonalWorkspace,
    ),
  };
}
