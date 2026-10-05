import type { PersonalWorkspace, UndoStudyCaptureInput } from "@guesant/saberes-domain";

export interface UndoStudyCapturePort {
  execute(input: UndoStudyCaptureInput): Promise<PersonalWorkspace>;
}
