import type { ChartOptionObject } from "./chart-option-object.interface";

export interface ChartBlock {
  type: "chart";
  title?: string;
  option: ChartOptionObject;
}
