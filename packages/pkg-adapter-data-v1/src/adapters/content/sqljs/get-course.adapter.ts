import { SqlJsContentRepository } from "./sql-js-content.repository";
import type { GetCoursePort } from "@guesant/saberes-application";

export class SqlJsGetCourseAdapter implements GetCoursePort {
  public constructor(private readonly store = new SqlJsContentRepository()) {}

  public execute(
    input: Parameters<GetCoursePort["execute"]>[0],
  ): ReturnType<GetCoursePort["execute"]> {
    return this.store.getCourse(input);
  }
}
