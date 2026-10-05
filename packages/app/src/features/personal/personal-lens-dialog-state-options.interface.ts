import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";
import type { PersonalLens } from "@guesant/saberes-application";

export interface PersonalLensDialogStateOptions {
  initialLens?: PersonalLens;

  onDelete?(id: string): Promise<void>;

  onSave(input: SavePersonalLensInput): Promise<void>;
}
