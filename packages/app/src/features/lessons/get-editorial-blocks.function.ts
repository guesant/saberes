import type { EditorialBlock, ParseEditorialBlocksResult } from "@guesant/saberes-application";

export function getEditorialBlocks(result?: ParseEditorialBlocksResult): EditorialBlock[] {
  return result?.status === "valid" ? result.blocks : [];
}
