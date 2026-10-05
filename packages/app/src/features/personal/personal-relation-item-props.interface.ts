import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalRelation, PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalRelationItemProps {
  selection: PersonalEntitySelection;
  relation: PersonalRelation;
  workspace: PersonalWorkspace;
  onArchive(id: string): Promise<void>;

  onRestore(id: string): Promise<void>;
}
