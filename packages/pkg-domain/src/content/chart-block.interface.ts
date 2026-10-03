import type { ChartOptionValue } from "./chart-option-value.type";

export interface ChartBlock {
  type: "chart";
  title?: string;
  option: { [key: string]: ChartOptionValue };
}
