import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices } from "@guesant/saberes-application";

export function useStudyPlanQueries(services: ApplicationServices, slug?: string) {
  const planQuery = useQuery({
    queryKey: ["study-plan", slug ?? "default"],
    queryFn: () => {
      return services.studyPlans.get.execute(slug);
    },
  });

  const progressQuery = useQuery({
    queryKey: ["plan-progress"],
    queryFn: () => {
      return services.progress.listPlanProgress.execute();
    },
  });

  return { planQuery, progressQuery };
}
