import { saveQuestionBookmark } from "./save-question-bookmark.function";
import type { ToggleQuestionBookmarkInput } from "./toggle-question-bookmark-input.interface";

export async function toggleQuestionBookmark(input: ToggleQuestionBookmarkInput): Promise<void> {
  if (input.bookmarked) {
    await input.services.progress.removeBookmark.execute(input.contentKey);
  } else {
    await saveQuestionBookmark({
      contentKey: input.contentKey,
      data: input.data,
      services: input.services,
    });
  }

  await input.queryClient.invalidateQueries({ queryKey: ["progress", "bookmarks"] });
}
