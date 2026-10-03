import type { ParseEditorialBlocksResult } from "@guesant/saberes-application";
import type { EditorialBlock } from "@guesant/saberes-domain";

export function getEditorialBlocks(result?: ParseEditorialBlocksResult): EditorialBlock[] {
  return result?.status === "valid" ? result.blocks : [];
}
