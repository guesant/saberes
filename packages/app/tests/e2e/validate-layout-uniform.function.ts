import { expect } from "@playwright/test";
import { layoutTolerance } from "./layout-integrity.test-support";

export function validateLayoutUniform(values: number[], message: string): void {
  if (values.length < 2) {
    return;
  }

  expect(Math.max(...values) - Math.min(...values), message)
    .toBeLessThanOrEqual(layoutTolerance);
}
