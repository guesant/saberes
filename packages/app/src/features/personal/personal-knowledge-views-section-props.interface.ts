import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalKnowledgeViewsSectionProps {
  onSaveLens(input: SavePersonalLensInput): Promise<void>;
  workspace: PersonalWorkspace;
}
