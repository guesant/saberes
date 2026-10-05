import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalKnowledgeViewsSectionProps {
  onDeleteLens(id: string): Promise<void>;

  onSaveLens(input: SavePersonalLensInput): Promise<void>;
  selection: PersonalEntitySelection;
  workspace: PersonalWorkspace;
}
