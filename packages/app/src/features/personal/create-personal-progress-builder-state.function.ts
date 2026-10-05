import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";

export function createPersonalProgressBuilderState(): PersonalProgressBuilderState {
  return {
    links: new Map(),
    unlinkedActivityIds: [],
    unlinkedAttemptIds: [],
    unlinkedSessionIds: [],
  };
}
