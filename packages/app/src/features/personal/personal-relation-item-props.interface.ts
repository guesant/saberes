import type { PersonalRelation } from "@guesant/saberes-application";

export interface PersonalRelationItemProps {
  relation: PersonalRelation;
  onArchive(id: string): Promise<void>;

  onRestore(id: string): Promise<void>;
}
