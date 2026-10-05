import { completeStudyCapture } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { CompleteStudyCapturePort } from "@guesant/saberes-application";
import type { CompleteStudyCaptureInput, PersonalWorkspace } from "@guesant/saberes-domain";

export class CompleteStudyCaptureAdapter implements CompleteStudyCapturePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: CompleteStudyCaptureInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const completedWorkspace = completeStudyCapture({ ...input, workspace });

    return this.store.savePersonalWorkspace(completedWorkspace);
  }
}
