import { restoreStudyCapture } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { RestoreStudyCapturePort } from "@guesant/saberes-application";
import type { PersonalWorkspace, RestoreStudyCaptureInput } from "@guesant/saberes-domain";

export class RestoreStudyCaptureAdapter implements RestoreStudyCapturePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: RestoreStudyCaptureInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const restoredWorkspace = restoreStudyCapture({ ...input, workspace });

    return this.store.savePersonalWorkspace(restoredWorkspace);
  }
}
