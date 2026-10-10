import type { CourseRoadmapStepCardProps } from "./course-roadmap-step-card.component";

export function getCourseRoadmapStepStatus(props: CourseRoadmapStepCardProps): string {
  if (props.completed) {
    return "Concluída";
  }

  if (props.current) {
    return "Próxima recomendada";
  }

  return "Disponível · siga na ordem que preferir";
}
