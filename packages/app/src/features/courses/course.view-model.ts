import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { startCourse } from "./start-course.function";
import type { CourseReadModel } from "@guesant/saberes-application";

export type CourseViewModelState = "loading" | "error" | "ready";

export interface CourseViewModel {
  state: CourseViewModelState;
  data: CourseReadModel | null;
  error: Error | null;
  reload: () => Promise<void>;
  startCourse: () => Promise<void>;
}

export function useCourseViewModel(slug: string | undefined): CourseViewModel {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["course", slug],
    enabled: Boolean(slug),
    queryFn: () => {
      if (!slug) {
        return Promise.resolve(null);
      }

      return services.courses.get.execute(slug);
    },
  });

  const enrollInCourse = async (): Promise<void> => {
    const course = query.data?.course;

    if (course) {
      await startCourse({ services, course });
    }
  };

  const state: CourseViewModelState = getQueryViewState(query);

  return {
    state,
    data: query.data ?? null,
    error: query.error ?? null,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    startCourse: enrollInCourse,
  };
}
