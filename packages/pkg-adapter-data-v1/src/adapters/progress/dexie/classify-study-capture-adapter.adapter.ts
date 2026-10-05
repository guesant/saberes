import { classifyStudyCapture } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ClassifyStudyCapturePort } from "@guesant/saberes-application";
import type { ClassifyStudyCaptureInput, PersonalWorkspace } from "@guesant/saberes-domain";

export class ClassifyStudyCaptureAdapter implements ClassifyStudyCapturePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: ClassifyStudyCaptureInput): Promise<PersonalWorkspace> {
    const workspace = await this.store.getPersonalWorkspace();

    const classifiedWorkspace = classifyStudyCapture({ ...input, workspace });

    return this.store.savePersonalWorkspace(classifiedWorkspace);
  }
}
