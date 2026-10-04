import { format } from "date-fns";

export function getStudyPlanStartDate(startDate: unknown): string {
  return typeof startDate === "string" ? startDate : format(new Date(), "yyyy-MM-dd");
}
