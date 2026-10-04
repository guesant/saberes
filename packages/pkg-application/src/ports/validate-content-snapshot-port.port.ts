import type { ContentSnapshotValidationInput } from "../models/content-snapshot-validation-input.interface";
import type { ContentSnapshotValidationResult } from "../models/content-snapshot-validation-result.type";

export interface ValidateContentSnapshotPort {
  execute(input: ContentSnapshotValidationInput): Promise<ContentSnapshotValidationResult>;
}
