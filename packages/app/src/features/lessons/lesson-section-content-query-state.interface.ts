import type { ParseEditorialBlocksResult } from "@guesant/saberes-application";

export interface LessonSectionContentQueryState {
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  data?: ParseEditorialBlocksResult;
}
