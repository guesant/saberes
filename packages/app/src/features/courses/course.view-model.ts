import { useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { getCourseViewProgress } from "./get-course-view-progress.function";
import { useCourseContentProgressQueries } from "./use-course-content-progress-queries.hook";
import { useCourseEnrollmentAction } from "./use-course-enrollment-action.hook";
import type { CourseProgress } from "./course-progress.interface";
import type { ActionState } from "../../types/action-state.type";
import type { Attempt, CourseReadModel, StudyRecord } from "@guesant/saberes-application";

export type CourseViewModelState = "loading" | "error" | "ready";

export interface CourseViewModel {
  state: CourseViewModelState;
  data: CourseReadModel | null | undefined;
  started: boolean;
  progress: CourseProgress;
  attempts: Attempt[] | undefined;
  lessonProgress: StudyRecord[] | undefined;
  assessmentItemsById: Record<string, Array<Record<string, unknown>> | undefined>;
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

  const { contentQuery: query, items: courseItems, progressQueries } =
    useCourseContentProgressQueries(services, slug);

  const courseProgress = getCourseViewProgress(slug, progressQueries, courseItems);

  const startAction = useCourseEnrollmentAction({
    attempts: progressQueries.attempts,
    course: query.data,
    lessonProgress: progressQueries.lessonProgress,
    assessmentItemsById: progressQueries.assessmentItemsById,
    queryClient,
    services,
  });

  return {
    state: getQueryViewState(query),
    data: query.data,
    ...courseProgress,
    attempts: progressQueries.attempts,
    lessonProgress: progressQueries.lessonProgress,
    assessmentItemsById: progressQueries.assessmentItemsById,
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
