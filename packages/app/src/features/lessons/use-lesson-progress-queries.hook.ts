import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, StudyRecord } from "@guesant/saberes-application";

export type LessonProgressQueries = {
  progress: StudyRecord[] | undefined;
  bookmarks: StudyRecord[] | undefined;
  progressError: Error | null;
  bookmarksError: Error | null;
};

export function useLessonProgressQueries(
  services: ApplicationServices,
  key: string | undefined,
): LessonProgressQueries {
  const progressQuery = useQuery({
    queryKey: ["progress", "lesson", key],
    queryFn: () => services.progress.listLessonProgress.execute(),
  });

  const bookmarksQuery = useQuery({
    queryKey: ["progress", "bookmarks"],
    queryFn: () => services.progress.listBookmarks.execute(),
  });

  return {
    progress: progressQuery.data,
    bookmarks: bookmarksQuery.data,
    progressError: progressQuery.error,
    bookmarksError: bookmarksQuery.error,
  };
}
