import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices } from "@guesant/saberes-application";

export function useCourseProgressRecords(services: ApplicationServices) {
  const enrollmentsQuery = useQuery({
    queryKey: ["progress", "enrollments"],
    queryFn: () => {return services.progress.listEnrollments.execute();},
  });

  const lessonProgressQuery = useQuery({
    queryKey: ["progress", "lessons"],
    queryFn: () => {return services.progress.listLessonProgress.execute();},
  });

  const attemptsQuery = useQuery({
    queryKey: ["progress", "attempts"],
    queryFn: () => {return services.progress.listAttempts.execute();},
  });

  return { enrollmentsQuery, lessonProgressQuery, attemptsQuery };
}
