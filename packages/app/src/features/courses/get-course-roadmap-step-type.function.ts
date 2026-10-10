import { getCourseLessonStepType } from "./get-course-lesson-step-type.function";

const labelsByType: Record<string, string> = {
  theory: "Teoria",
  example: "Exemplo",
  practice: "Prática",
  assessment: "Vestibular",
  vestibular: "Vestibular",
  correction: "Correção",
  review: "Revisão",
};

export function getCourseRoadmapStepType(item: Record<string, unknown>): string {
  if (!item.lesson_id) {
    return labelsByType[String(item.item_type)] || "Etapa";
  }

  return getCourseLessonStepType(item);
}
