import { UITypography } from "@guesant/saberes-ui";

export interface CourseRoadmapModuleDescriptionProps {
  description: unknown;
}

export function CourseRoadmapModuleDescription(props: CourseRoadmapModuleDescriptionProps) {
  if (!props.description) {
    return null;
  }

  return (
    <UITypography variant="body2" color="text.secondary">
      {String(props.description)}
    </UITypography>
  );
}
