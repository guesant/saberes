import { describe, expect, it, vi } from "vitest";
import { createSaveLessonBookmarkAction } from "./create-save-lesson-bookmark-action.function";
import type { ApplicationServices } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

describe("createSaveLessonBookmarkAction", () => {
  it("removes an existing lesson bookmark instead of saving it again", async () => {
    const removeBookmark = vi.fn().mockResolvedValue(undefined);
    const saveBookmark = vi.fn().mockResolvedValue(undefined);
    const invalidateQueries = vi.fn().mockResolvedValue(undefined);
    const services = {
      lessons: { bookmark: { execute: saveBookmark } },
      progress: { removeBookmark: { execute: removeBookmark } },
    } as unknown as ApplicationServices;
    const queryClient = { invalidateQueries } as unknown as QueryClient;

    const action = createSaveLessonBookmarkAction({
      bookmarked: true,
      contentKey: "lesson:mechanics",
      lesson: undefined,
      queryClient,
      services,
    });

    await action();

    expect(removeBookmark).toHaveBeenCalledWith("lesson:mechanics");
    expect(saveBookmark).not.toHaveBeenCalled();
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["progress", "bookmarks"] });
  });

  it("saves a lesson bookmark when it is not already saved", async () => {
    const removeBookmark = vi.fn().mockResolvedValue(undefined);
    const saveBookmark = vi.fn().mockResolvedValue(undefined);
    const invalidateQueries = vi.fn().mockResolvedValue(undefined);
    const services = {
      lessons: { bookmark: { execute: saveBookmark } },
      progress: { removeBookmark: { execute: removeBookmark } },
    } as unknown as ApplicationServices;
    const queryClient = { invalidateQueries } as unknown as QueryClient;

    const action = createSaveLessonBookmarkAction({
      bookmarked: false,
      contentKey: "lesson:mechanics",
      lesson: undefined,
      queryClient,
      services,
    });

    await action();

    expect(saveBookmark).toHaveBeenCalledWith({
      contentKey: "lesson:mechanics",
      data: { lessonId: undefined, title: undefined, type: "lesson" },
    });
    expect(removeBookmark).not.toHaveBeenCalled();
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["progress", "bookmarks"] });
  });
});
