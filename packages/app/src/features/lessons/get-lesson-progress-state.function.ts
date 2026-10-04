import { getLessonBookmarked } from "./get-lesson-bookmarked.function";
import { getLessonCompleted } from "./get-lesson-completed.function";
import { getLessonSectionIndex } from "./get-lesson-section-index.function";
import type { StudyRecord } from "@guesant/saberes-application";

export type GetLessonProgressStateInput = {
  progress: StudyRecord[] | undefined;
  bookmarks: StudyRecord[] | undefined;
  contentKey: string;
};

export function getLessonProgressState(input: GetLessonProgressStateInput) {
  return {
    completed: getLessonCompleted({ records: input.progress, contentKey: input.contentKey }),
    bookmarked: getLessonBookmarked({ records: input.bookmarks, contentKey: input.contentKey }),
    sectionIndex: getLessonSectionIndex({ records: input.progress, contentKey: input.contentKey }),
  };
}
