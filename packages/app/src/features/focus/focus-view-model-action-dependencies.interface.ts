import type { FocusSession } from "@guesant/saberes-application";

export interface FocusViewModelActionDependencies {
  active: FocusSession | null;
  createId(): string;

  paused: FocusSession | null;
  reload(): Promise<void>;

  save(session: FocusSession): Promise<void>;
}
