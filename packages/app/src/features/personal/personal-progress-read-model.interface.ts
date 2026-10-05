import type { PersonalProgressLink } from "./personal-progress-link.interface";

export interface PersonalProgressReadModel {
  links: PersonalProgressLink[];
  unlinkedSessionIds: string[];
  unlinkedAttemptIds: string[];
  unlinkedActivityIds: string[];
}
