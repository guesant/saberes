import { DexieProgressStore } from "./dexie-progress.store";
import type { EnrollCoursePort } from "@guesant/saberes-application";

export class EnrollCourseAdapter implements EnrollCoursePort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<EnrollCoursePort["execute"]>[0],
  ): ReturnType<EnrollCoursePort["execute"]> {
    return this.store.enrollCourse(input.contentKey, input.data);
  }
}
