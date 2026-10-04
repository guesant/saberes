import type { ContentSnapshotValidationIssue } from "./content-snapshot-validation-issue.interface";
import type { ContentSnapshotValidationSummary } from "./content-snapshot-validation-summary.interface";

export type ContentSnapshotValidationResult = {
  status: "valid" | "invalid";
  issues: ContentSnapshotValidationIssue[];
  summary: ContentSnapshotValidationSummary;
};
