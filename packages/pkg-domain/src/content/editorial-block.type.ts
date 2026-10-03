import type { CalloutBlock } from "./callout-block.interface";
import type { ChartBlock } from "./chart-block.interface";
import type { ComparisonTableBlock } from "./comparison-table-block.interface";
import type { FormulaBlock } from "./formula-block.interface";
import type { ImageBlock } from "./image-block.interface";
import type { KnowledgeMapBlock } from "./knowledge-map-block.interface";
import type { ParametricSceneBlock } from "./parametric-scene-block.interface";
import type { QuestionLinkBlock } from "./question-link-block.interface";
import type { SummaryBlock } from "./summary-block.interface";
import type { VideoBlock } from "./video-block.interface";

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
