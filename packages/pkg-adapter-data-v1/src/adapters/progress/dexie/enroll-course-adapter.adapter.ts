import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { EnrollCoursePort } from "@guesant/saberes-application";

export class EnrollCourseAdapter implements EnrollCoursePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<EnrollCoursePort["execute"]>[0],
  ): ReturnType<EnrollCoursePort["execute"]> {
    return this.store.enrollCourse(input.contentKey, input.data);
  }
}
