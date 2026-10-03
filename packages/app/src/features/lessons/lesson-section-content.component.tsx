import { LessonSectionContentView } from "./lesson-section-content-view.component";
import { useLessonSectionContentViewModel } from "./use-lesson-section-content.view-model.hook";
import type { LessonSectionContentInput } from "./lesson-section-content-input.type";

export type LessonSectionContentProps = LessonSectionContentInput & {
  onQuestion: (questionId: string | number) => void;
};

export function LessonSectionContent(props: LessonSectionContentProps) {
  const { section, onQuestion } = props;

  const viewModel = useLessonSectionContentViewModel({ section });

  return <LessonSectionContentView viewModel={viewModel} onQuestion={onQuestion} />;
}
