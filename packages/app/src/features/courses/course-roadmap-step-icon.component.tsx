import {
  UIAutoStoriesIcon,
  UICheckCircleIcon,
  UIEventNoteIcon,
  UIQuizIcon,
} from "@guesant/saberes-ui";
import { getCourseRoadmapStepType } from "./get-course-roadmap-step-type.function";

const iconsByType: Record<string, typeof UIAutoStoriesIcon> = {
  Teoria: UIAutoStoriesIcon,
  "Exemplo resolvido": UIAutoStoriesIcon,
  Exemplo: UIQuizIcon,
  Prática: UIQuizIcon,
};

export interface CourseRoadmapStepIconProps {
  item: Record<string, unknown>;
  completed: boolean;
}

export function CourseRoadmapStepIcon(props: CourseRoadmapStepIconProps) {
  if (props.completed) {
    return <UICheckCircleIcon color="success" aria-hidden="true" />;
  }

  const Icon = iconsByType[getCourseRoadmapStepType(props.item)] || UIEventNoteIcon;

  return <Icon aria-hidden="true" />;
}
