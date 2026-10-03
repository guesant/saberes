import type { EditorialValidationIssue } from "./editorial-validation-issue.interface";
import type { EditorialBlock } from "@guesant/saberes-domain";

export type ParseEditorialBlocksResult =
  | { status: "valid"; blocks: EditorialBlock[] }
  | { status: "invalid"; issues: EditorialValidationIssue[] };
