import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { CourseRoadmapModule } from "./course-roadmap-module.component";
import { getCourseItemCompleted } from "./get-course-item-completed.function";
import { getCourseRoadmapModuleFirstStepNumber } from "./get-course-roadmap-module-first-step-number.function";
import { getCourseTrackableItems } from "./get-course-trackable-items.function";
import type { Attempt, StudyRecord } from "@guesant/saberes-application";

export type CourseModulesProps = {
  modules: Array<Record<string, unknown>>;
  items: Array<Record<string, unknown>>;
  attempts: Attempt[] | undefined;
  lessonProgress: StudyRecord[] | undefined;
  courseSlug?: string;
  assessmentItemsById?: Record<string, Array<Record<string, unknown>> | undefined>;
};

export function CourseModules(props: CourseModulesProps) {
  const trackableItems = getCourseTrackableItems(props.items);

  const currentItem = trackableItems.find((item) => {
    return !getCourseItemCompleted({ ...props, item });
  });

  return (
    <UIContentGroup variant="content">
      <UITypography variant="body2" color="text.secondary">Início do roteiro</UITypography>
      {props.modules.map((module, index) => {
        return (
          <CourseRoadmapModule
            key={String(module.id)}
            modules={props.modules}
            items={props.items}
            attempts={props.attempts}
            lessonProgress={props.lessonProgress}
            courseSlug={props.courseSlug}
            assessmentItemsById={props.assessmentItemsById}
            currentItem={currentItem}
            module={module}
            firstStepNumber={getCourseRoadmapModuleFirstStepNumber(props.modules, props.items, index)}
          />
        );
      })}
      <UITypography variant="body2" color="text.secondary">Fim do roteiro</UITypography>
      <UITypography variant="caption" color="text.secondary">
        Concluir uma etapa registra sua atividade; isso não significa domínio do conteúdo.
      </UITypography>
    </UIContentGroup>
  );
}
