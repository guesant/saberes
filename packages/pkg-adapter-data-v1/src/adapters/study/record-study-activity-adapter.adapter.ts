import { recordStudyActivity } from "../../services/record-study-activity.service";
import type { RecordStudyActivityPort } from "@guesant/saberes-application";

export class RecordStudyActivityAdapter implements RecordStudyActivityPort {
  public execute(
    input: Parameters<RecordStudyActivityPort["execute"]>[0],
  ): ReturnType<RecordStudyActivityPort["execute"]> {
    return recordStudyActivity(input);
  }
}
