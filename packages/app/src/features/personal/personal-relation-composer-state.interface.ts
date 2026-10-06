import type { PersonalRelationKind } from "@guesant/saberes-application";

export interface PersonalRelationComposerState {
  canCreate: boolean;
  create(): Promise<void>;

  kind: PersonalRelationKind;
  setKind(kind: PersonalRelationKind): void;

  setSource(value: string): void;

  setTarget(value: string): void;
  source: string;
  target: string;
}
