import type { ReviewViewModelState } from "./review.view-model";

export function getReviewViewState(isPending: boolean, isError: boolean): ReviewViewModelState {
  if (isPending) {
    return "loading";
  }

  if (isError) {
    return "error";
  }

  return "ready";
}
