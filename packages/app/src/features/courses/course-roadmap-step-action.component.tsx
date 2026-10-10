import { CourseRoadmapStepLink } from "./course-roadmap-step-link.component";
import { CourseRoadmapStepStatic } from "./course-roadmap-step-static.component";
import type { CourseRoadmapStepCardProps as CourseRoadmapStepActionProps } from "./course-roadmap-step-card.component";

export function CourseRoadmapStepAction(props: CourseRoadmapStepActionProps) {
  if (props.href) {
    return <CourseRoadmapStepLink item={props.item} href={props.href} stepNumber={props.stepNumber} current={props.current} completed={props.completed} courseSlug={props.courseSlug} />;
  }

  return <CourseRoadmapStepStatic item={props.item} href={props.href} stepNumber={props.stepNumber} current={props.current} completed={props.completed} courseSlug={props.courseSlug} />;
}
