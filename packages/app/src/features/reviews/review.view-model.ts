import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createReviewActions } from "./create-review-actions.function";
import { getDueReviewTargets } from "./get-due-review-targets.function";
import { getReviewPreviews } from "./get-review-previews.function";
import { getReviewViewState } from "./get-review-view-state.function";
import type { ReviewPreview } from "./review-preview.type";
import type { FsrsRating, ReviewTarget } from "@guesant/saberes-application";

export type ReviewViewModelState = "loading" | "error" | "ready";

export interface ReviewViewModel {
  state: ReviewViewModelState;
  targets: ReviewTarget[];
  previews: Record<string, ReviewPreview>;
  error: Error | null;
  reload: () => Promise<void>;
  postpone: (target: ReviewTarget) => Promise<void>;
  rate: (target: ReviewTarget, rating: FsrsRating) => Promise<void>;
  suspend: (target: ReviewTarget) => Promise<void>;
}

export function useReviewViewModel(): ReviewViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["progress", "reviews"],
    queryFn: () => services.progress.listReviewTargets.execute(),
  });

  const targets = getDueReviewTargets(query.data || [], new Date());

  const previews: Record<string, ReviewPreview> = getReviewPreviews({
    targets,
    preview: (target) => services.scheduler.preview.execute({ target }),
  });

  const actions = createReviewActions({ services, queryClient });

  return {
    state: getReviewViewState(query.isPending, query.isError),
    targets,
    previews,
    error: query.error || null,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    postpone: actions.postpone,
    rate: actions.rate,
    suspend: actions.suspend,
  };
}
