import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type {
  PersonalRelation,
  PersonalRelationEndpoint,
  PersonalRelationKind,
  PersonalWorkspace,
} from "@guesant/saberes-application";

export interface PersonalRelationsSectionProps {
  selection: PersonalEntitySelection;
  relations: PersonalRelation[];
  workspace: PersonalWorkspace;
  onArchive(id: string): Promise<void>;

  onCreate(
    kind: PersonalRelationKind,
    source: PersonalRelationEndpoint,
    target: PersonalRelationEndpoint,
  ): Promise<void>;

  onRestore(id: string): Promise<void>;
}
