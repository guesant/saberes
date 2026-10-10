import { useQueries } from "@tanstack/react-query";
import type { ApplicationServices } from "@guesant/saberes-application";

export function useCourseAssessmentItems(
  services: ApplicationServices,
  items: Array<Record<string, unknown>>,
) {
  const assessmentIds = Array.from(new Set(
    items
      .map((item) => {return item.assessment_set_id;})
      .filter((id) => {return id !== undefined && id !== null;})
      .map(String),
  ));

  const queries = useQueries({
    queries: assessmentIds.map((id) => {return {
      queryKey: ["assessment", id],
      queryFn: () => {return services.assessments.get.execute(id);},
    };}),
  });

  const assessmentItemsById = Object.fromEntries(assessmentIds.map((id, index) => {
    const assessment = queries[index].data;

    return [id, assessment?.items.map((item) => {return { ...item };})];
  }));

  return { assessmentItemsById, error: queries.find((query) => {return query.error;})?.error || null };
}
