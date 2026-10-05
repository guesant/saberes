export interface CalculationOrigin {
  readonly kind: "academic-discipline" | "review-target" | "study-plan" | "study-record";
  readonly reference: string;
}
