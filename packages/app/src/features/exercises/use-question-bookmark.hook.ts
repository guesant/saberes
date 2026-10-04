import { useQuery } from "@tanstack/react-query";
import { getQuestionBookmarked } from "./get-question-bookmarked.function";
import { getQuestionContentKey } from "./get-question-content-key.function";
import { saveQuestionBookmark } from "./save-question-bookmark.function";
import type { QuestionBookmarkState } from "./question-bookmark-state.interface";
import type { UseQuestionBookmarkInput } from "./use-question-bookmark-input.type";

export function useQuestionBookmark(input: UseQuestionBookmarkInput): QuestionBookmarkState {
  const query = useQuery({
    queryKey: ["progress", "bookmarks"],
    queryFn: () => {
      return input.services.progress.listBookmarks.execute();
    },
  });

  const contentKey = getQuestionContentKey(input.data, input.key);

  return {
    bookmarked: getQuestionBookmarked(query.data, contentKey),
    error: query.error,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    save: async (): Promise<void> => {
      await saveQuestionBookmark({
        contentKey,
        data: input.data,
        services: input.services,
      });

      await input.queryClient.invalidateQueries({ queryKey: ["progress", "bookmarks"] });
    },
  };
}
