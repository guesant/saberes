import { describe, expect, it, vi } from "vitest";
import { EnrollCourseCommandHandler } from "./commands/enroll-course.command-handler";

describe("EnrollCourseCommandHandler", () => {
  it("encaminha a intenção de iniciar um curso para a port", async () => {
    const execute = vi.fn()
      .mockResolvedValue({ contentKey: "course:sample" });

    const handler = new EnrollCourseCommandHandler({ execute });

    const input = { contentKey: "course:sample" };

    await expect(handler.execute(input))
      .resolves.toEqual({ contentKey: "course:sample" });

    expect(execute)
      .toHaveBeenCalledWith(input);
  });
});
