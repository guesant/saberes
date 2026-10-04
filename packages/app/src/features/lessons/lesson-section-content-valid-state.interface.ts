import type { ParseEditorialBlocksValidResult } from "@guesant/saberes-application";

export interface LessonSectionContentValidState {
  status: "valid";
  result: ParseEditorialBlocksValidResult;
}
