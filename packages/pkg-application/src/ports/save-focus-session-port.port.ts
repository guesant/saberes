import type { FocusSession } from "@guesant/saberes-domain";

export interface SaveFocusSessionPort {
  execute(session: FocusSession): Promise<FocusSession>;
}
