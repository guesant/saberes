import { CourseRoadmapStepCard } from "./course-roadmap-step-card.component";
import { getCourseItemHref } from "./get-course-item-href.function";
import type { CourseRoadmapStepProps } from "./course-roadmap-step-props.interface";

export function CourseRoadmapStep(props: CourseRoadmapStepProps) {
  return (
    <CourseRoadmapStepCard
      completed={props.completed}
      current={props.current}
      href={getCourseItemHref(props.item, props.courseSlug)}
      item={props.item}
      stepNumber={props.stepNumber}
    />
  );
}
