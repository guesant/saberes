import type { PersonalProgressLink } from "./personal-progress-link.interface";

export interface PersonalProgressBuilderState {
  links: Map<string, PersonalProgressLink>;
  unlinkedSessionIds: string[];
  unlinkedAttemptIds: string[];
  unlinkedActivityIds: string[];
}
