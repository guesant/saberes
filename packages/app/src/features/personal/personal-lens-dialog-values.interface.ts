import type { PersonalLensView } from "@guesant/saberes-application";

export interface PersonalLensDialogValues {
  name: string;

  open: boolean;

  view: PersonalLensView;
}
