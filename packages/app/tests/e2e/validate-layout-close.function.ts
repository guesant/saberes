import { expect } from "@playwright/test";
import { layoutTolerance } from "./layout-integrity.test-support";

export function validateLayoutClose(actual: number, expected: number, message: string): void {
  expect(Math.abs(actual - expected), message)
    .toBeLessThanOrEqual(layoutTolerance);
}
