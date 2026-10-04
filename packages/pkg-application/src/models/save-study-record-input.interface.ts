import type { ContentKey } from "@guesant/saberes-domain";

export interface SaveStudyRecordInput<TData = Record<string, unknown>> {
  contentKey: ContentKey | string;
  data?: TData;
}
