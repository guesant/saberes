import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { getLessonContentKey } from "./get-lesson-content-key.function";
import { saveLessonBookmark } from "./save-lesson-bookmark.function";
import { saveLessonProgress } from "./save-lesson-progress.function";
import type { LessonReadModel, StudyRecord } from "@guesant/saberes-application";

export type LessonViewModelState = "loading" | "error" | "ready";

export interface LessonViewModel {
  state: LessonViewModelState;
  data: LessonReadModel | null;
  error: Error | null;
  reload: () => Promise<void>;
  saveProgress: (completed: boolean) => Promise<StudyRecord>;
  saveBookmark: () => Promise<StudyRecord>;
}

export function useLessonViewModel(key: string | undefined): LessonViewModel {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["lesson", key],
    enabled: Boolean(key),
    queryFn: () => {
      if (!key) {
        return Promise.resolve(null);
      }

      return services.lessons.get.execute(key);
    },
  });

  const lesson = query.data?.lesson;

  const contentKey = getLessonContentKey({ lesson, fallback: key });

  const saveProgress = (completed: boolean): Promise<StudyRecord> =>
    saveLessonProgress({ services, contentKey, lesson, completed });

  const saveBookmark = (): Promise<StudyRecord> =>
    saveLessonBookmark({ services, contentKey, lesson });

  const state: LessonViewModelState = getQueryViewState(query);

  return {
    state,
    data: query.data ?? null,
    error: query.error ?? null,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    saveProgress,
    saveBookmark,
  };
}
