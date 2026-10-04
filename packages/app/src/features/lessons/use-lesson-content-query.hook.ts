import { useQuery } from "@tanstack/react-query";
import { loadLesson } from "./load-lesson.function";
import type { ApplicationServices, LessonReadModel } from "@guesant/saberes-application";

export type UseLessonContentQueryInput = {
  services: ApplicationServices;
  key: string | undefined;
};

export function useLessonContentQuery(input: UseLessonContentQueryInput) {
  return useQuery<LessonReadModel | null>({
    queryKey: ["lesson", input.key],
    enabled: Boolean(input.key),
    queryFn: () => loadLesson({ services: input.services, key: input.key }),
  });
}
