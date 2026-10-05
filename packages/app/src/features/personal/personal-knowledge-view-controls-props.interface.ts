import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";
import type { PersonalLens, PersonalLensView } from "@guesant/saberes-application";

export interface PersonalKnowledgeViewControlsProps {
  lenses: PersonalLens[];

  onDeleteLens(id: string): Promise<void>;

  onSaveLens(input: SavePersonalLensInput): Promise<void>;

  onLensSelect(lens: PersonalLens): void;

  onViewChange(view: PersonalLensView): void;
  view: PersonalLensView;
}
