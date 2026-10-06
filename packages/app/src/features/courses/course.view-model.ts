import { useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { getCourseItems } from "./get-course-items.function";
import { getCourseProgress } from "./get-course-progress.function";
import { getCourseStarted } from "./get-course-started.function";
import { useCourseContentQuery } from "./use-course-content-query.hook";
import { useCourseEnrollmentAction } from "./use-course-enrollment-action.hook";
import { useCourseProgressQueries } from "./use-course-progress-queries.hook";
import type { CourseProgress } from "./course-progress.interface";
import type { ActionState } from "../../types/action-state.type";
import type { CourseReadModel } from "@guesant/saberes-application";

export type CourseViewModelState = "loading" | "error" | "ready";

export interface CourseViewModel {
  state: CourseViewModelState;
  data: CourseReadModel | null | undefined;
  started: boolean;
  progress: CourseProgress;
  error: Error | null;
  progressError: Error | null;
  startError: Error | null;
  startState: ActionState;
  reload(): Promise<void>;

  startCourse(): Promise<void>;
}

export function useCourseViewModel(slug: string | undefined): CourseViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const query = useCourseContentQuery({ services, slug });

  const progressQueries = useCourseProgressQueries(services);

  const startAction = useCourseEnrollmentAction({
    attempts: progressQueries.attempts,
    course: query.data,
    lessonProgress: progressQueries.lessonProgress,
    queryClient,
    services,
  });

  return {
    state: getQueryViewState(query),
    data: query.data,
    started: getCourseStarted({ records: progressQueries.enrollments, slug }),
    progress: getCourseProgress({
      attempts: progressQueries.attempts,
      items: getCourseItems(query.data),
      lessonProgress: progressQueries.lessonProgress,
    }),
    error: query.error,
    progressError: progressQueries.error,
    startError: startAction.error,
    startState: startAction.state,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    startCourse: startAction.start,
  };
}
