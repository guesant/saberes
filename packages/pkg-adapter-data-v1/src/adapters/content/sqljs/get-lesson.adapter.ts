import type { ContentRepositoryContract } from "./content-repository.contract";
import type { GetLessonPort } from "@guesant/saberes-application";

export class SqlJsGetLessonAdapter implements GetLessonPort {
  public constructor(private readonly store: ContentRepositoryContract) {}

  public execute(
    input: Parameters<GetLessonPort["execute"]>[0],
  ): ReturnType<GetLessonPort["execute"]> {
    return this.store.getLesson(input);
  }
}
