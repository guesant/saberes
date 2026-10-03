import type { ParseEditorialBlocksInput } from "../models/parse-editorial-blocks-input.interface";
import type { ParseEditorialBlocksResult } from "../models/parse-editorial-blocks-result.type";

export interface ParseEditorialBlocksPort {
  execute(input: ParseEditorialBlocksInput): Promise<ParseEditorialBlocksResult>;
}
