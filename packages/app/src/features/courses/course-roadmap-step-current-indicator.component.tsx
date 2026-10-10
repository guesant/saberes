import { UIChip } from "@guesant/saberes-ui";

export interface CourseRoadmapStepCurrentIndicatorProps {
  current: boolean;
}

export function CourseRoadmapStepCurrentIndicator(props: CourseRoadmapStepCurrentIndicatorProps) {
  if (!props.current) {
    return null;
  }

  return <UIChip color="primary" label="Agora" size="small" />;
}
