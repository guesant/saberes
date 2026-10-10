import { CourseRoadmapStep } from "./course-roadmap-step.component";
import { getCourseItemCompleted } from "./get-course-item-completed.function";
import type { CourseRoadmapModuleProps } from "./course-roadmap-module.component";

export interface CourseRoadmapModuleStepProps {
  context: CourseRoadmapModuleProps;
  item: Record<string, unknown>;
  stepNumber: number;
  current: boolean;
}

export function CourseRoadmapModuleStep(props: CourseRoadmapModuleStepProps) {
  const completed = getCourseItemCompleted({ attempts: props.context.attempts,
    item: props.item, lessonProgress: props.context.lessonProgress,
    assessmentItemsById: props.context.assessmentItemsById });

  return <CourseRoadmapStep completed={completed} current={props.current}
    item={props.item} stepNumber={props.stepNumber} courseSlug={props.context.courseSlug} />;
}
