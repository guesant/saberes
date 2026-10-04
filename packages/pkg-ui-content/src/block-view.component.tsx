import { lazy, Suspense } from "react";
import { UICalloutBlockView } from "./blocks/callout-block-view.component";
import { UIComparisonTableBlockView } from "./blocks/comparison-table-block-view.component";
import { UIFormulaBlockView } from "./blocks/formula-block-view.component";
import { UIImageBlockView } from "./blocks/image-block-view.component";
import { UIQuestionLinkBlockView } from "./blocks/question-link-block-view.component";
import { UISummaryBlockView } from "./blocks/summary-block-view.component";
import { UIVideoBlockView } from "./blocks/video-block-view.component";
import { UIContentLoadingFallback } from "./content-loading-fallback.component";
import type { EditorialBlock, KnowledgeGraph } from "@guesant/saberes-application";
import type { ReactNode } from "react";

const UIChartBlock = lazy(() =>
  import("./visualization/chart-block.component").then(({ UIChartBlock: Component }) => ({
    default: Component,
  })),
);

const UIKnowledgeMapBlock = lazy(() =>
  import("./visualization/knowledge-map-block.component").then(
    ({ UIKnowledgeMapBlock: Component }) => ({
      default: Component,
    }),
  ),
);

const UIParametricSceneBlock = lazy(() =>
  import("./visualization/parametric-scene-block.component").then(
    ({ UIParametricSceneBlock: Component }) => ({
      default: Component,
    }),
  ),
);

export interface UIBlockViewProps {
  block: EditorialBlock;
  knowledgeGraph?: KnowledgeGraph;
  onQuestion?(questionId: string | number): void;
}

export function UIBlockView(props: UIBlockViewProps) {
  const { block, knowledgeGraph, onQuestion } = props;

  let content: ReactNode = null;

  switch (block.type) {
    case "callout":
      content = <UICalloutBlockView block={block} />;

      break;

    case "comparison_table":
      content = <UIComparisonTableBlockView block={block} />;

      break;

    case "formula":
      content = <UIFormulaBlockView block={block} />;

      break;

    case "image":
      content = <UIImageBlockView block={block} />;

      break;

    case "question_link":
      content = <UIQuestionLinkBlockView block={block} onQuestion={onQuestion} />;

      break;

    case "summary":
      content = <UISummaryBlockView block={block} />;

      break;

    case "video":
      content = <UIVideoBlockView block={block} />;

      break;

    case "chart":
      content = <UIChartBlock block={block} />;

      break;

    case "knowledge_map":
      content = <UIKnowledgeMapBlock block={block} graph={knowledgeGraph} />;

      break;

    case "parametric_scene":
      content = <UIParametricSceneBlock block={block} />;

      break;

    default:
      break;
  }

  return <Suspense fallback={<UIContentLoadingFallback />}>{content}</Suspense>;
}
