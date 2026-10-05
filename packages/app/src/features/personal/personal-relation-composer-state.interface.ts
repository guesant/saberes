import type { PersonalRelationKind } from "@guesant/saberes-application";

export interface PersonalRelationComposerState {
  canCreate: boolean;
  create(): Promise<void>;

  kind: PersonalRelationKind;
  setKind(kind: PersonalRelationKind): void;

  setSourceId(value: string): void;

  setSourceType(value: string): void;

  setTargetId(value: string): void;

  setTargetType(value: string): void;
  sourceId: string;
  sourceType: string;
  targetId: string;
  targetType: string;
}
