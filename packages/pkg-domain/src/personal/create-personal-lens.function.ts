import type { CreatePersonalLensInput } from "./create-personal-lens-input.interface";
import type { PersonalLens } from "../models/personal-lens.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function createPersonalLens(input: CreatePersonalLensInput): PersonalWorkspace {
  const lenses = input.workspace.lenses ?? [];

  const existingLens = lenses.find((lens) => {
    return lens.id === input.id;
  });

  if (existingLens) {
    return input.workspace;
  }

  const lens: PersonalLens = {
    createdAt: input.now,
    id: input.id,
    name: input.name,
    recordTypes: input.recordTypes,
    updatedAt: input.now,
    view: input.view,
  };

  return { ...input.workspace, lenses: [...lenses, lens] };
}
