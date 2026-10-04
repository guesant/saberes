import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, Attempt, StudyRecord } from "@guesant/saberes-application";

export type CourseProgressQueries = {
  attempts: Attempt[] | undefined;
  error: Error | null;
  enrollments: StudyRecord[] | undefined;
  lessonProgress: StudyRecord[] | undefined;
};

export function useCourseProgressQueries(services: ApplicationServices): CourseProgressQueries {
  const enrollmentsQuery = useQuery({
    queryKey: ["progress", "enrollments"],
    queryFn: () => {
      return services.progress.listEnrollments.execute();
    },
  });

  const lessonProgressQuery = useQuery({
    queryKey: ["progress", "lessons"],
    queryFn: () => {
      return services.progress.listLessonProgress.execute();
    },
  });

  const attemptsQuery = useQuery({
    queryKey: ["progress", "attempts"],
    queryFn: () => {
      return services.progress.listAttempts.execute();
    },
  });

  return {
    attempts: attemptsQuery.data,
    error: enrollmentsQuery.error || lessonProgressQuery.error || attemptsQuery.error || null,
    enrollments: enrollmentsQuery.data,
    lessonProgress: lessonProgressQuery.data,
  };
}
