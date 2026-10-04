import { recordStudyActivity } from "../../services/record-study-activity.service";
import type { ProgressStorageContract } from "../../storage/progress-storage.contract";
import type { RecordStudyActivityPort } from "@guesant/saberes-application";

export class RecordStudyActivityAdapter implements RecordStudyActivityPort {
  public constructor(private readonly storage: ProgressStorageContract) {}

  public execute(
    input: Parameters<RecordStudyActivityPort["execute"]>[0],
  ): ReturnType<RecordStudyActivityPort["execute"]> {
    return recordStudyActivity(this.storage, input);
  }
}
