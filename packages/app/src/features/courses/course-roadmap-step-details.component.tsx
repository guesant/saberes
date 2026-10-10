import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { getCourseRoadmapStepDuration } from "./get-course-roadmap-step-duration.function";
import { getCourseRoadmapStepStatus } from "./get-course-roadmap-step-status.function";
import { getCourseRoadmapStepType } from "./get-course-roadmap-step-type.function";
import type { CourseRoadmapStepCardProps as CourseRoadmapStepDetailsProps } from "./course-roadmap-step-card.component";

export function CourseRoadmapStepDetails(props: CourseRoadmapStepDetailsProps) {
  let statusColor = "text.secondary";

  if (props.current) {
    statusColor = "primary";
  }

  const title = String(props.item.title || "Etapa do curso");

  return (
    <UIContentGroup variant="content">
      <UITypography variant="overline" color="text.secondary">
        {getCourseRoadmapStepType(props.item)}
      </UITypography>
      <UITypography variant="subtitle1">
        {props.stepNumber}. {title}
      </UITypography>
      <UITypography variant="body2" color="text.secondary">
        {String(props.item.description || "")}
      </UITypography>
      <UITypography variant="caption" color={statusColor}>
        {getCourseRoadmapStepStatus(props)}
        {getCourseRoadmapStepDuration(props.item)}
      </UITypography>
    </UIContentGroup>
  );
}
