import type { EditorialValidationIssue } from "./editorial-validation-issue.interface";

export interface ParseEditorialBlocksInvalidResult {
  status: "invalid";
  issues: EditorialValidationIssue[];
}
