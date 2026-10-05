import { useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createLessonProgressViewModel } from "./create-lesson-progress-view-model.function";
import { getLessonContentKey } from "./get-lesson-content-key.function";
import { getLessonProgressState } from "./get-lesson-progress-state.function";
import { getLessonViewData } from "./get-lesson-view-data.function";
import { useLessonActions } from "./use-lesson-actions.hook";
import { useLessonContentQuery } from "./use-lesson-content-query.hook";
import { useLessonProgressQueries } from "./use-lesson-progress-queries.hook";
import { useLessonStudySession } from "./use-lesson-study-session.hook";
import type { ActionState } from "../../types/action-state.type";
import type { LessonReadModel } from "@guesant/saberes-application";

export type LessonViewModelState = "loading" | "error" | "ready";

export interface LessonViewModel {
  state: LessonViewModelState;
  data: LessonReadModel | null;
  completed: boolean;
  bookmarked: boolean;
  sectionIndex: number | undefined;
  error: Error | null;
  progressError: Error | null;
  progressActionError: Error | null;
  progressActionState: ActionState;
  bookmarkActionError: Error | null;
  bookmarkActionState: ActionState;
  reload(): Promise<void>;

  saveProgress(completed: boolean): Promise<void>;

  saveBookmark(): Promise<void>;

  saveSection(sectionIndex: number): Promise<void>;
}

export function useLessonViewModel(key: string | undefined): LessonViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const query = useLessonContentQuery({ services, key });

  const progressQueries = useLessonProgressQueries(services, key);

  const lessonViewData = getLessonViewData(query.data);

  const contentKey = getLessonContentKey({ lesson: lessonViewData.lesson, fallback: key });

  useLessonStudySession({ services, contentKey, enabled: Boolean(lessonViewData.data) });

  const progressState = getLessonProgressState({
    progress: progressQueries.progress,
    bookmarks: progressQueries.bookmarks,
    contentKey,
  });

  const lessonActions = useLessonActions({
    services,
    queryClient,
    contentKey,
    lesson: lessonViewData.lesson,
    queryKey: key,
    completed: progressState.completed,
  });

  return {
    state: getQueryViewState(query),
    data: lessonViewData.data,
    ...createLessonProgressViewModel({ actions: lessonActions, progress: progressQueries, state: progressState }),
    error: query.error ?? null,
    reload: async (): Promise<void> => { await query.refetch(); },
    saveProgress: lessonActions.progress.save,
    saveBookmark: lessonActions.bookmark.save,
    saveSection: lessonActions.saveSection,
  };
}
