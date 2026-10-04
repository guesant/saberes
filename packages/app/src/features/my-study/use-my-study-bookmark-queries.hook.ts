import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, StudyRecord } from "@guesant/saberes-application";

export type MyStudyBookmarkQueries = {
  bookmarks: StudyRecord[] | undefined;
  error: Error | null;
  reload(): Promise<void>;
};

export function useMyStudyBookmarkQueries(services: ApplicationServices): MyStudyBookmarkQueries {
  const bookmarksQuery = useQuery({
    queryKey: ["progress", "bookmarks"],
    queryFn: () => {
      return services.progress.listBookmarks.execute();
    },
  });

  return {
    bookmarks: bookmarksQuery.data,
    error: bookmarksQuery.error,
    reload: async (): Promise<void> => {
      await bookmarksQuery.refetch();
    },
  };
}
