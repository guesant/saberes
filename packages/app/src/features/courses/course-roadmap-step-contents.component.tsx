import { UIListItemIcon, UIStartAlignedRow } from "@guesant/saberes-ui";
import { CourseRoadmapStepDetails } from "./course-roadmap-step-details.component";
import { CourseRoadmapStepIcon } from "./course-roadmap-step-icon.component";
import type { CourseRoadmapStepCardProps as CourseRoadmapStepContentsProps } from "./course-roadmap-step-card.component";

export function CourseRoadmapStepContents(props: CourseRoadmapStepContentsProps) {
  return (
    <UIStartAlignedRow>
      <UIListItemIcon>
        <CourseRoadmapStepIcon completed={props.completed} item={props.item} />
      </UIListItemIcon>
      <CourseRoadmapStepDetails item={props.item} href={props.href} stepNumber={props.stepNumber} current={props.current} completed={props.completed} courseSlug={props.courseSlug} />
    </UIStartAlignedRow>
  );
}
