import type { PersonalLensView } from "@guesant/saberes-application";

export interface SavePersonalLensInput {
  id?: string;
  name: string;
  view: PersonalLensView;
}
