import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getQuestionBookmarked } from "./get-question-bookmarked.function";
import { getQuestionContentKey } from "./get-question-content-key.function";
import { toggleQuestionBookmark } from "./toggle-question-bookmark.function";
import type { QuestionBookmarkState } from "./question-bookmark-state.interface";
import type { UseQuestionBookmarkInput } from "./use-question-bookmark-input.type";

export function useQuestionBookmark(input: UseQuestionBookmarkInput): QuestionBookmarkState {
  const [actionError, setActionError] = useState<Error | null>(null);

  const [pending, setPending] = useState(false);

  const query = useQuery({
    queryKey: ["progress", "bookmarks"],
    queryFn: () => {
      return input.services.progress.listBookmarks.execute();
    },
  });

  const contentKey = getQuestionContentKey(input.data, input.key);

  const bookmarked = getQuestionBookmarked(query.data, contentKey);

  return {
    bookmarked,
    pending,
    error: actionError ?? query.error,
    reload: async (): Promise<void> => {
      setActionError(null);

      await query.refetch();
    },
    toggle: async (): Promise<void> => {
      if (pending) {
        return;
      }

      setPending(true);

      setActionError(null);

      try {
        await toggleQuestionBookmark({ ...input, bookmarked, contentKey });
      } catch {
        setActionError(new Error("Não foi possível alterar a questão salva."));
      } finally {
        setPending(false);
      }
    },
  };
}
