import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createStartCourseAction } from "./create-start-course-action.function";
import { getCourseItems } from "./get-course-items.function";
import { getCourseProgress } from "./get-course-progress.function";
import { getCourseStarted } from "./get-course-started.function";
import { loadCourse } from "./load-course.function";
import { useCourseProgressQueries } from "./use-course-progress-queries.hook";
import type { CourseProgress } from "./course-progress.interface";
import type { CourseReadModel } from "@guesant/saberes-application";

export type CourseViewModelState = "loading" | "error" | "ready";

export interface CourseViewModel {
  state: CourseViewModelState;
  data: CourseReadModel | null | undefined;
  started: boolean;
  progress: CourseProgress;
  error: Error | null;
  progressError: Error | null;
  reload: () => Promise<void>;
  startCourse: () => Promise<void>;
}

export function useCourseViewModel(slug: string | undefined): CourseViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["course", slug],
    enabled: Boolean(slug),
    queryFn: () => loadCourse({ services, slug }),
  });

  const progressQueries = useCourseProgressQueries(services);

  const enrollInCourse = createStartCourseAction({
    services,
    queryClient,
    course: query.data?.course,
  });

  const state: CourseViewModelState = getQueryViewState(query);

  return {
    state,
    data: query.data,
    started: getCourseStarted({ records: progressQueries.enrollments, slug }),
    progress: getCourseProgress({
      attempts: progressQueries.attempts,
      items: getCourseItems(query.data),
      lessonProgress: progressQueries.lessonProgress,
    }),
    error: query.error,
    progressError: progressQueries.error,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    startCourse: enrollInCourse,
  };
}
