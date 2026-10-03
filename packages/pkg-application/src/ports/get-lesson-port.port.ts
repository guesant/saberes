import type { LessonReadModel } from "../models/index";
import type { ContentKey } from "@guesant/saberes-domain";

export interface GetLessonPort {
  execute(key: ContentKey | string): Promise<LessonReadModel | null>;
}
