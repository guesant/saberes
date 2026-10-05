import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function savePersonalLens(input: SavePersonalLensInput): PersonalWorkspace {
  const lenses = input.workspace.lenses ?? [];

  const hasLens = lenses.some((lens) => {
    return lens.id === input.lens.id;
  });

  const nextLenses = hasLens
    ? lenses.map((currentLens) => {
      return currentLens.id === input.lens.id ? input.lens : currentLens;
    })
    : [...lenses, input.lens];

  return { ...input.workspace, lenses: nextLenses };
}
