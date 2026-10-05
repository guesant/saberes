import type { LessonViewModel } from "./lesson.view-model";
import type { LessonReadModel } from "@guesant/saberes-application";

export interface LessonViewReadyContentProps {
  data: LessonReadModel;
  onQuestion(questionId: string | number): void;
  viewModel: LessonViewModel;
}
