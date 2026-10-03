import type { CalloutBlock } from "./callout-block.interface.ts";
import type { ChartBlock } from "./chart-block.interface.ts";
import type { ComparisonTableBlock } from "./comparison-table-block.interface.ts";
import type { FormulaBlock } from "./formula-block.interface.ts";
import type { ImageBlock } from "./image-block.interface.ts";
import type { KnowledgeMapBlock } from "./knowledge-map-block.interface.ts";
import type { ParametricSceneBlock } from "./parametric-scene-block.interface.ts";
import type { QuestionLinkBlock } from "./question-link-block.interface.ts";
import type { SummaryBlock } from "./summary-block.interface.ts";
import type { VideoBlock } from "./video-block.interface.ts";

export type EditorialBlock =
  | CalloutBlock
  | ChartBlock
  | ComparisonTableBlock
  | FormulaBlock
  | ImageBlock
  | KnowledgeMapBlock
  | ParametricSceneBlock
  | QuestionLinkBlock
  | SummaryBlock
  | VideoBlock;
