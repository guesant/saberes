import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { CourseRoadmapModuleDescription } from "./course-roadmap-module-description.component";

export interface CourseRoadmapModuleHeaderProps {
  module: Record<string, unknown>;
}

export function CourseRoadmapModuleHeader(props: CourseRoadmapModuleHeaderProps) {
  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h6">
        {Number(props.module.position) + 1}. {String(props.module.title)}
      </UITypography>
      <CourseRoadmapModuleDescription description={props.module.description} />
    </UIContentGroup>
  );
}
