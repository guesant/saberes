import { useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createReviewActions } from "./create-review-actions.function";
import { createStartReviewStudySessionAction } from "./create-start-review-study-session-action.function";
import { getReviewQueueState } from "./get-review-queue-state.function";
import { getReviewRetentionImpact } from "./get-review-retention-impact.function";
import { getReviewViewModelPreviews } from "./get-review-view-model-previews.function";
import { getReviewViewState } from "./get-review-view-state.function";
import { useReviewQuery } from "./use-review-query.hook";
import { useReviewRetentionViewModel } from "./use-review-retention.view-model.hook";
import type { ReviewLoadSummary } from "./review-load-summary.interface";
import type { ReviewPreview } from "./review-preview.type";
import type { ReviewRetentionImpact } from "./review-retention-impact.interface";
import type { FsrsRating, ReviewTarget } from "@guesant/saberes-application";

export type ReviewViewModelState = "loading" | "error" | "ready";

export interface ReviewViewModel {
  state: ReviewViewModelState;
  targets: ReviewTarget[];
  load: ReviewLoadSummary;
  previews: Record<string, ReviewPreview>;
  error: Error | null;
  reload(): Promise<void>;

  postpone(target: ReviewTarget): Promise<void>;

  rate(target: ReviewTarget, rating: FsrsRating): Promise<void>;

  suspend(target: ReviewTarget): Promise<void>;

  startSession(): Promise<string | null>;

  retention: number;
  retentionImpact: ReviewRetentionImpact;
  setRetention(value: number): Promise<void>;
}

export function useReviewViewModel(): ReviewViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const query = useReviewQuery(services);

  const { retention, setRetention } = useReviewRetentionViewModel({ queryClient, services });

  const { targets, load } = getReviewQueueState(query.data || [], new Date());

  const previews = getReviewViewModelPreviews({
    retention,
    services,
    targets,
  });

  const actions = createReviewActions({ queryClient, retention, services });

  const startSession = createStartReviewStudySessionAction({
    services,
    targets,
  });

  return {
    state: getReviewViewState(query.isPending, query.isError),
    targets,
    load,
    previews,
    error: query.error || null,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    postpone: actions.postpone,
    rate: actions.rate,
    suspend: actions.suspend,
    startSession,
    retention,
    retentionImpact: getReviewRetentionImpact({ load, retention }),
    setRetention,
  };
}
