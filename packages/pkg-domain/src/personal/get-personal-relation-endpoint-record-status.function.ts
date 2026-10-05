import type { ResolvePersonalRelationEndpointInput } from "./resolve-personal-relation-endpoint-input.interface";

export function getPersonalRelationEndpointRecordStatus(
  input: ResolvePersonalRelationEndpointInput,
): "archived" | "available" | "missing" {
  if (input.endpoint.recordType === "activity") {
    const activity = input.workspace.activities.find((item) => {return item.id === input.endpoint.id;});

    if (activity === undefined) {
      return "missing";
    }

    return activity.status === "archived" ? "archived" : "available";
  }

  if (input.endpoint.recordType === "capture") {
    const capture = input.workspace.captures.find((item) => {return item.id === input.endpoint.id;});

    if (capture === undefined) {
      return "missing";
    }

    return capture.archived ? "archived" : "available";
  }

  if (input.endpoint.recordType === "checklist") {
    const checklist = input.workspace.checklists.find((item) => {return item.id === input.endpoint.id;});

    if (checklist === undefined) {
      return "missing";
    }

    return checklist.archived ? "archived" : "available";
  }

  const note = input.workspace.notes.find((item) => {return item.id === input.endpoint.id;});

  if (note !== undefined) {
    return note.archived ? "archived" : "available";
  }

  const reference = input.workspace.references.find((item) => {return item.id === input.endpoint.id;});

  if (reference === undefined) {
    return "missing";
  }

  return reference.archived ? "archived" : "available";
}
