import { useAppServices } from "../../composition/use-app-services.hook";
import { usePreferencesQuery } from "../preferences/use-preferences-query.hook";
import { LessonSectionContentView } from "./lesson-section-content-view.component";
import { useLessonSectionContentViewModel } from "./use-lesson-section-content.view-model.hook";
import type { LessonSectionContentInput } from "./lesson-section-content-input.type";

export interface LessonSectionContentProps extends LessonSectionContentInput {
  onQuestion(questionId: string | number): void;
}

export function LessonSectionContent(props: LessonSectionContentProps) {
  const { section, onQuestion } = props;

  const services = useAppServices();

  const preferencesQuery = usePreferencesQuery(services);

  const viewModel = useLessonSectionContentViewModel({ section });

  return (
    <LessonSectionContentView
      showRichContent={preferencesQuery.data?.richContent ?? true}
      viewModel={viewModel}
      onQuestion={onQuestion}
    />
  );
}
