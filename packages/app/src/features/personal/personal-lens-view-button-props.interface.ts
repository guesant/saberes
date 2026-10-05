import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";
import type { PersonalLens } from "@guesant/saberes-application";

export interface PersonalLensViewButtonProps {
  lens: PersonalLens;

  onDelete(id: string): Promise<void>;

  onSave(input: SavePersonalLensInput): Promise<void>;

  onSelect(lens: PersonalLens): void;
}
