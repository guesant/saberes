import { UIContentSurface } from "@guesant/saberes-ui";
import { CourseRoadmapStepAction } from "./course-roadmap-step-action.component";
import { CourseRoadmapStepCurrentIndicator } from "./course-roadmap-step-current-indicator.component";
import type { CourseRoadmapStepProps } from "./course-roadmap-step-props.interface";

export interface CourseRoadmapStepCardProps extends CourseRoadmapStepProps {
  href: string | null;
}

export function CourseRoadmapStepCard(props: CourseRoadmapStepCardProps) {
  return (
    <UIContentSurface mode="outlined">
      <CourseRoadmapStepCurrentIndicator current={props.current} />
      <CourseRoadmapStepAction item={props.item} href={props.href} stepNumber={props.stepNumber} current={props.current} completed={props.completed} courseSlug={props.courseSlug} />
    </UIContentSurface>
  );
}
