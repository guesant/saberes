import { archiveStudyCapture } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ArchiveStudyCapturePort } from "@guesant/saberes-application";
import type { ArchiveStudyCaptureInput, PersonalWorkspace } from "@guesant/saberes-domain";

export class ArchiveStudyCaptureAdapter implements ArchiveStudyCapturePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: ArchiveStudyCaptureInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const archivedWorkspace = archiveStudyCapture({ ...input, workspace });

    return this.store.savePersonalWorkspace(archivedWorkspace);
  }
}
