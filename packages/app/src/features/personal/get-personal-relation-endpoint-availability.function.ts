import type { PersonalRelationEndpointAvailability } from "./personal-relation-endpoint-availability.type";
import type {
  PersonalRelationEndpoint,
  PersonalWorkspace,
} from "@guesant/saberes-application";

export function getPersonalRelationEndpointAvailability(
  workspace: PersonalWorkspace,
  endpoint: PersonalRelationEndpoint,
): PersonalRelationEndpointAvailability {
  if (["goal", "question", "topic"].includes(endpoint.recordType)) {
    return "external";
  }

  const records = [
    ...workspace.activities.map((record) => {return { id: record.id, archived: record.status === "archived" };}),
    ...workspace.captures.map((record) => {return { id: record.id, archived: record.archived };}),
    ...workspace.checklists.map((record) => {return { id: record.id, archived: record.archived };}),
    ...workspace.notes.map((record) => {return { id: record.id, archived: record.archived };}),
    ...workspace.references.map((record) => {return { id: record.id, archived: record.archived };}),
  ];

  const record = records.find((candidate) => { return candidate.id === endpoint.id; });

  if (!record) {
    return "missing";
  }

  return record.archived ? "archived" : "available";
}
