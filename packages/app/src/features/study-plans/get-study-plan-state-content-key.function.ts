export function getStudyPlanStateContentKey(slug: string | undefined): string {
  return `plan:${slug || "default"}:state`;
}
