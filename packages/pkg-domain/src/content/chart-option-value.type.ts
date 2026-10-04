import type { ChartOptionObject } from "./chart-option-object.interface";

export type ChartOptionValue =
  string | number | boolean | null | ChartOptionValue[] | ChartOptionObject;
