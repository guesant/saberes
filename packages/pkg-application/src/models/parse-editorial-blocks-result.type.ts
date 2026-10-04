import type { ParseEditorialBlocksInvalidResult } from "./parse-editorial-blocks-invalid-result.interface";
import type { ParseEditorialBlocksValidResult } from "./parse-editorial-blocks-valid-result.interface";

export type ParseEditorialBlocksResult =
  ParseEditorialBlocksValidResult | ParseEditorialBlocksInvalidResult;
