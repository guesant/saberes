import { getPersonalReferenceSourceKind } from "./get-personal-reference-source-kind.function";
import type { PersonalReference, PersonalWorkspace } from "@guesant/saberes-application";

export interface AddPersonalReferenceInput {
  workspace: PersonalWorkspace;
  id: string;
  title: string;
  source: string;
  contentKey?: string;
  now: string;
}

export function addPersonalReference(input: AddPersonalReferenceInput): PersonalWorkspace {
  const sourceKind = getPersonalReferenceSourceKind(input.source);

  const reference: PersonalReference = {
    id: input.id,
    title: input.title,
    contentKey: input.contentKey,
    type: sourceKind === "external" ? "link" : "local",
    source: input.source,
    location: input.source,
    rights: "",
    available: true,
    favorite: false,
    archived: false,
    tags: [],
    privateNote: "",
    createdAt: input.now,
    updatedAt: input.now,
  };

  return { ...input.workspace, references: [...input.workspace.references, reference] };
}
