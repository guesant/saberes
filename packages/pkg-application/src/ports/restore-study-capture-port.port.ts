import type { PersonalWorkspace, RestoreStudyCaptureInput } from "@guesant/saberes-domain";

export interface RestoreStudyCapturePort {
  execute(input: RestoreStudyCaptureInput): Promise<PersonalWorkspace>;
}
