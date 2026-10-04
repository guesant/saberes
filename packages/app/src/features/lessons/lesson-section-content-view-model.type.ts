import type { LessonSectionContentErrorState } from "./lesson-section-content-error-state.interface";
import type { LessonSectionContentInvalidState } from "./lesson-section-content-invalid-state.interface";
import type { LessonSectionContentLoadingState } from "./lesson-section-content-loading-state.interface";
import type { LessonSectionContentReadyState } from "./lesson-section-content-ready-state.interface";

export type LessonSectionContentViewModel =
  | LessonSectionContentLoadingState
  | LessonSectionContentErrorState
  | LessonSectionContentInvalidState
  | LessonSectionContentReadyState;
