import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices } from "@guesant/saberes-application";

export function useStudyPlanQueries(services: ApplicationServices, slug?: string) {
  const planQuery = useQuery({
    queryKey: ["study-plan", slug ?? "default"],
    queryFn: () => services.studyPlans.get.execute(slug),
  });

  const progressQuery = useQuery({
    queryKey: ["plan-progress"],
    queryFn: () => services.progress.listPlanProgress.execute(),
  });

  return { planQuery, progressQuery };
}
