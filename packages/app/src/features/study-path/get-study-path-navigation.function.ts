import { getCourseItemHref } from "../courses/get-course-item-href.function";
import type { StudyPathContext } from "./study-path-context.interface";

export interface StudyPathNavigation {
  title: string;
  position: number;
  total: number;
  previous: string | null;
  next: string | null;
  roadmap: string;
}

export function getStudyPathNavigation(
  items: Array<Record<string, unknown>>,
  courseSlug: string,
  context: StudyPathContext,
): StudyPathNavigation | null {
  const available = items.filter((item) => {
    return Boolean(getCourseItemHref(item));
  });

  const index = available.findIndex((item) => {
    const href = getCourseItemHref(item);

    return String(item.id) === context.stepId && href?.split("?")[0] === context.pathname;
  });

  if (index < 0) {
    return null;
  }

  const getContextualHref = (item: Record<string, unknown> | undefined): string | null => {
    if (!item) {
      return null;
    }

    return getCourseItemHref(item, courseSlug);
  };

  return {
    title: String(available[index].title),
    position: index + 1,
    total: available.length,
    previous: getContextualHref(available[index - 1]),
    next: getContextualHref(available[index + 1]),
    roadmap: `/cursos/${encodeURIComponent(courseSlug)}`,
  };
}
