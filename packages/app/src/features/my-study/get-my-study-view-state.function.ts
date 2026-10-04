import type { MyStudyViewModelState } from "./my-study.view-model";

export function getMyStudyViewState(state: MyStudyViewModelState): MyStudyViewModelState {
  return state === "error" ? "error" : state;
}
