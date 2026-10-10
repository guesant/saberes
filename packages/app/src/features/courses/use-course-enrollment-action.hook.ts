import { createStartCourseAction } from "./create-start-course-action.function";
import { useCourseStartAction } from "./use-course-start-action.hook";
import { useCourseStartNavigationAction } from "./use-course-start-navigation-action.hook";
import type { CourseEnrollmentAction } from "./course-enrollment-action.interface";
import type { UseCourseEnrollmentActionInput } from "./use-course-enrollment-action-input.interface";

export function useCourseEnrollmentAction(
  input: UseCourseEnrollmentActionInput,
): CourseEnrollmentAction {
  const action = createStartCourseAction({
    services: input.services,
    queryClient: input.queryClient,
    course: input.course?.course,
  });

  const startAction = useCourseStartAction({ action });

  const start = useCourseStartNavigationAction({
    action: startAction.start,
    attempts: input.attempts,
    course: input.course,
    lessonProgress: input.lessonProgress,
    assessmentItemsById: input.assessmentItemsById,
  });

  return { error: startAction.error, start, state: startAction.state };
}
