import { resolveApplicationPort } from "./resolve-application-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressReadAdditionalPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "listAcademicDisciplines"
  | "listFocusSessions"
  | "listStudyGoals"
  | "getPersonalWorkspace"
  | "listCalendarEntries"
  | "listPersonalReminderCandidates"
> {
  return {
    listAcademicDisciplines: resolveApplicationPort(container, "listAcademicDisciplines"),
    listFocusSessions: resolveApplicationPort(container, "listFocusSessions"),
    listStudyGoals: resolveApplicationPort(container, "listStudyGoals"),
    getPersonalWorkspace: resolveApplicationPort(container, "getPersonalWorkspace"),
    listCalendarEntries: resolveApplicationPort(container, "listCalendarEntries"),
    listPersonalReminderCandidates: resolveApplicationPort(
      container,
      "listPersonalReminderCandidates",
    ),
  };
}
