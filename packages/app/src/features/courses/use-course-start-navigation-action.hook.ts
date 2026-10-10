import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseItems } from "./get-course-items.function";
import { getCourseSlug } from "./get-course-slug.function";
import { getNextCourseItemHref } from "./get-next-course-item-href.function";
import type { CourseStartNavigationAction } from "./course-start-navigation-action.interface";
import type { UseCourseStartNavigationActionInput } from "./use-course-start-navigation-action-input.interface";

export function useCourseStartNavigationAction(
  input: UseCourseStartNavigationActionInput,
): CourseStartNavigationAction {
  const navigate = useNavigate();

  return useCallback(async () => {
    try {
      await input.action();
    } catch {
      return;
    }

    const nextItemHref = getNextCourseItemHref({
      attempts: input.attempts,
      items: getCourseItems(input.course),
      lessonProgress: input.lessonProgress,
      courseSlug: getCourseSlug(input.course),
      assessmentItemsById: input.assessmentItemsById,
    });

    if (nextItemHref) {
      navigate(nextItemHref);
    }
  }, [input, navigate]);
}
