import type { EditorialBlock } from "@guesant/saberes-domain";

export interface ParseEditorialBlocksValidResult {
  status: "valid";
  blocks: EditorialBlock[];
}
