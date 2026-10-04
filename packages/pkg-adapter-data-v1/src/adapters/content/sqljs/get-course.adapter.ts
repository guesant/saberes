import type { ContentRepositoryContract } from "./content-repository.contract";
import type { GetCoursePort } from "@guesant/saberes-application";

export class SqlJsGetCourseAdapter implements GetCoursePort {
  public constructor(private readonly store: ContentRepositoryContract) {}

  public execute(
    input: Parameters<GetCoursePort["execute"]>[0],
  ): ReturnType<GetCoursePort["execute"]> {
    return this.store.getCourse(input);
  }
}
