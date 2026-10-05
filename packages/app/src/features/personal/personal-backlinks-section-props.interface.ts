import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalRelation, PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalBacklinksSectionProps {
  selection: PersonalEntitySelection;
  relations: PersonalRelation[];
  workspace: PersonalWorkspace;
  onArchive(id: string): Promise<void>;

  onRestore(id: string): Promise<void>;
}
