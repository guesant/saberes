import type { FocusSession } from "@guesant/saberes-domain";

export interface ListFocusSessionsPort {
  execute(): Promise<FocusSession[]>;
}
