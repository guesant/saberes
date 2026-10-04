import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApplicationServices, ContentReleaseReadModel } from "@guesant/saberes-application";

export function useMyStudyContentReleaseQuery(
  services: ApplicationServices,
): UseQueryResult<ContentReleaseReadModel, Error> {
  return useQuery({
    queryKey: ["content", "release"],
    queryFn: () => {
      return services.editorial.getRelease.execute();
    },
  });
}
