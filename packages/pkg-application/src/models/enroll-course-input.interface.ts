import type { ContentKey } from "@guesant/saberes-domain";

export interface EnrollCourseInput {
  contentKey: ContentKey | string;
  data?: Record<string, unknown>;
}
