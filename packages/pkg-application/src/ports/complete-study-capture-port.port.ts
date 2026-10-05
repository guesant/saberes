import type { CompleteStudyCaptureInput, PersonalWorkspace } from "@guesant/saberes-domain";

export interface CompleteStudyCapturePort {
  execute(input: CompleteStudyCaptureInput): Promise<PersonalWorkspace>;
}
