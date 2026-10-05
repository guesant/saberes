import type { ArchiveStudyCaptureInput, PersonalWorkspace } from "@guesant/saberes-domain";

export interface ArchiveStudyCapturePort {
  execute(input: ArchiveStudyCaptureInput): Promise<PersonalWorkspace>;
}
