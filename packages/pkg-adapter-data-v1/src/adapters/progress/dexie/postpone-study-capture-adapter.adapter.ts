import { postponeStudyCapture } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { PostponeStudyCapturePort } from "@guesant/saberes-application";
import type { PersonalWorkspace, PostponeStudyCaptureInput } from "@guesant/saberes-domain";

export class PostponeStudyCaptureAdapter implements PostponeStudyCapturePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: PostponeStudyCaptureInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const postponedWorkspace = postponeStudyCapture({ ...input, workspace });

    return this.store.savePersonalWorkspace(postponedWorkspace);
  }
}
