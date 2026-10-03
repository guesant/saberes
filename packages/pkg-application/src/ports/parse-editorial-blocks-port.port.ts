import type { ParseEditorialBlocksInput } from "../models/parse-editorial-blocks-input.interface.ts";
import type { ParseEditorialBlocksResult } from "../models/parse-editorial-blocks-result.type.ts";

export interface ParseEditorialBlocksPort {
  execute(input: ParseEditorialBlocksInput): Promise<ParseEditorialBlocksResult>;
}
