import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { PersonalProgressReadModel } from "./personal-progress-read-model.interface";

export function buildPersonalProgressReadModel(
  state: PersonalProgressBuilderState,
): PersonalProgressReadModel {
  return {
    links: Array.from(state.links.values()),
    unlinkedActivityIds: state.unlinkedActivityIds,
    unlinkedAttemptIds: state.unlinkedAttemptIds,
    unlinkedSessionIds: state.unlinkedSessionIds,
  };
}
