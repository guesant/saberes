import type { ClassifyStudyCaptureInput, PersonalWorkspace } from "@guesant/saberes-domain";

export interface ClassifyStudyCapturePort {
  execute(input: ClassifyStudyCaptureInput): Promise<PersonalWorkspace>;
}
