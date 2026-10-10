import { getCourseLessonPathname } from "./get-course-lesson-pathname.function";
import { getCoursePracticePathname } from "./get-course-practice-pathname.function";
import { getCourseQuestionPathname } from "./get-course-question-pathname.function";

export function getCourseItemPathname(item: Record<string, unknown>): string | null {
  if (item.item_type === "review") {
    return "/revisoes";
  }

  if (item.lesson_id) {
    return getCourseLessonPathname(item);
  }

  if (item.assessment_set_id) {
    return `/avaliacoes/${encodeURIComponent(String(item.assessment_set_id))}`;
  }

  return getCourseQuestionPathname(item) || getCoursePracticePathname(item);
}
