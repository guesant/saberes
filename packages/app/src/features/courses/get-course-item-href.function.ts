import { addCourseStepContext } from "./add-course-step-context.function";
import { getCourseItemPathname } from "./get-course-item-pathname.function";

export function getCourseItemHref(
  item: Record<string, unknown>,
  courseSlug?: string,
): string | null {
  const pathname = getCourseItemPathname(item);

  if (!pathname) {
    return null;
  }

  if (!courseSlug) {
    return pathname;
  }

  return addCourseStepContext(pathname, courseSlug, item.id);
}
