import { validateLayoutClose } from "./validate-layout-close.function";
import type { LayoutGapMeasurement } from "./layout-gap-measurement.type";

const gapPixelsByToken: Record<string, number> = {
  lg: 24,
  md: 16,
  none: 0,
  sm: 8,
  xl: 32,
  xs: 4,
};

export function validateLayoutGap(
  measurement: LayoutGapMeasurement,
  token: string,
  layout: string,
): void {
  const expected = gapPixelsByToken[token];

  if (expected === undefined || layout === "bottom-tabs") {
    return;
  }

  let values = [measurement.columnGap, measurement.rowGap];

  if (layout === "stack") {
    values = [measurement.rowGap];
  }

  if (layout === "row" || layout === "cluster") {
    values = [measurement.columnGap];
  }

  values.forEach((value) => {
    validateLayoutClose(value, expected, `${layout} must use the ${token} gap token`);
  });
}
