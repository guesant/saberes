import { validateLayoutClose } from "./validate-layout-close.function";
import type { LayoutGapContext } from "./layout-gap-context.interface";
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
  context: LayoutGapContext,
): void {
  let expected = gapPixelsByToken[context.token];

  if (context.token === "section") {
    expected = context.viewportWidth >= 900 ? 32 : 24;
  }

  if (expected === undefined || context.layout === "bottom-tabs") {
    return;
  }

  let values = [measurement.columnGap, measurement.rowGap];

  if (context.layout === "stack") {
    values = [measurement.rowGap];
  }

  if (context.layout === "row" || context.layout === "cluster") {
    values = [measurement.columnGap];
  }

  values.forEach((value) => {
    validateLayoutClose(value, expected, `${context.layout} must use the ${context.token} gap token`);
  });
}
