import type { MyStudyViewModelState } from "./my-study.view-model";

export function getMyStudyViewState(isPending: boolean): MyStudyViewModelState {
  if (isPending) {
    return "loading";
  }

  return "ready";
}
