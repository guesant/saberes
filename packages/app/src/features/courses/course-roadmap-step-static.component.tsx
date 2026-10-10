import { UIListItem } from "@guesant/saberes-ui";
import { CourseRoadmapStepContents } from "./course-roadmap-step-contents.component";
import type { CourseRoadmapStepCardProps as CourseRoadmapStepStaticProps } from "./course-roadmap-step-card.component";

export function CourseRoadmapStepStatic(props: CourseRoadmapStepStaticProps) {
  return (
    <UIListItem>
      <CourseRoadmapStepContents item={props.item} href={props.href} stepNumber={props.stepNumber} current={props.current} completed={props.completed} courseSlug={props.courseSlug} />
    </UIListItem>
  );
}
