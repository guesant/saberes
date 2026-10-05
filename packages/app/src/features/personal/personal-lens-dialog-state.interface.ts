import type { PersonalLensView } from "@guesant/saberes-application";

export interface PersonalLensDialogState {
  close(): void;

  name: string;

  deleteLens(): Promise<void>;

  onNameChange(name: string): void;

  save(): Promise<void>;

  onViewChange(view: PersonalLensView): void;

  open: boolean;

  openDialog(): void;

  view: PersonalLensView;
}
