import type { SaveBookmarkCommandHandler } from "../commands/save-bookmark.command-handler";
import type { SaveLessonProgressCommandHandler } from "../commands/save-lesson-progress.command-handler";
import type { GetLessonQueryHandler } from "../queries/get-lesson.query-handler";

export type LessonServices = {
  get: GetLessonQueryHandler;
  saveProgress: SaveLessonProgressCommandHandler;
  bookmark: SaveBookmarkCommandHandler;
};
