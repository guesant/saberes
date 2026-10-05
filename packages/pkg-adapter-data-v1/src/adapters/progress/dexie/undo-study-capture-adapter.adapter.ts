import { undoStudyCapture } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { UndoStudyCapturePort } from "@guesant/saberes-application";
import type { PersonalWorkspace, UndoStudyCaptureInput } from "@guesant/saberes-domain";

export class UndoStudyCaptureAdapter implements UndoStudyCapturePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: UndoStudyCaptureInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const undoneWorkspace = undoStudyCapture({ ...input, workspace });

    return this.store.savePersonalWorkspace(undoneWorkspace);
  }
}
