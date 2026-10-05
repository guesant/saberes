import type { PersonalWorkspace, PostponeStudyCaptureInput } from "@guesant/saberes-domain";

export interface PostponeStudyCapturePort {
  execute(input: PostponeStudyCaptureInput): Promise<PersonalWorkspace>;
}
