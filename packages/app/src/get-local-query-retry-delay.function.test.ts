import { describe, expect, it } from "vitest";
import { getLocalQueryRetryDelay } from "./get-local-query-retry-delay.function";

describe("getLocalQueryRetryDelay", () => {
  it("uses a short bounded backoff for transient local failures", () => {
    expect(getLocalQueryRetryDelay(0)).toBe(250);

    expect(getLocalQueryRetryDelay(1)).toBe(500);

    expect(getLocalQueryRetryDelay(2)).toBe(1000);

    expect(getLocalQueryRetryDelay(8)).toBe(1000);
  });
});
