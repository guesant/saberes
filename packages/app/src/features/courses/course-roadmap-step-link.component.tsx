import { UIArrowForwardIcon, UIListItemButton } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import { CourseRoadmapStepContents } from "./course-roadmap-step-contents.component";
import type { CourseRoadmapStepCardProps } from "./course-roadmap-step-card.component";

export interface CourseRoadmapStepLinkProps extends CourseRoadmapStepCardProps {
  href: string;
}

export function CourseRoadmapStepLink(props: CourseRoadmapStepLinkProps) {
  let current: "step" | undefined;

  if (props.current) {
    current = "step";
  }

  return (
    <UIListItemButton
      aria-current={current}
      component={Link}
      to={props.href}
    >
      <CourseRoadmapStepContents item={props.item} href={props.href} stepNumber={props.stepNumber} current={props.current} completed={props.completed} courseSlug={props.courseSlug} />
      <UIArrowForwardIcon aria-hidden="true" />
    </UIListItemButton>
  );
}
