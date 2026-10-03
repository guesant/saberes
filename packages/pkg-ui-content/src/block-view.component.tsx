import { lazy, Suspense } from "react";
import { CalloutBlockView } from "./blocks/callout-block-view.component";
import { ComparisonTableBlockView } from "./blocks/comparison-table-block-view.component";
import { FormulaBlockView } from "./blocks/formula-block-view.component";
import { ImageBlockView } from "./blocks/image-block-view.component";
import { QuestionLinkBlockView } from "./blocks/question-link-block-view.component";
import { SummaryBlockView } from "./blocks/summary-block-view.component";
import { VideoBlockView } from "./blocks/video-block-view.component";
import { ContentLoadingFallback } from "./content-loading-fallback.component";
import type { EditorialBlock, KnowledgeGraph } from "@guesant/saberes-application";
import type { ReactNode } from "react";

const ChartBlock = lazy(() =>
  import("./visualization/chart-block.component").then(({ ChartBlock: Component }) => ({
    default: Component,
  })),
);

const KnowledgeMapBlock = lazy(() =>
  import("./visualization/knowledge-map-block.component").then(
    ({ KnowledgeMapBlock: Component }) => ({
      default: Component,
    }),
  ),
);

const ParametricSceneBlock = lazy(() =>
  import("./visualization/parametric-scene-block.component").then(
    ({ ParametricSceneBlock: Component }) => ({
      default: Component,
    }),
  ),
);

export type BlockViewProps = {
  block: EditorialBlock;
  knowledgeGraph?: KnowledgeGraph;
  onQuestion?: (questionId: string | number) => void;
};

export function BlockView(props: BlockViewProps) {
  const { block, knowledgeGraph, onQuestion } = props;

  let content: ReactNode = null;

  switch (block.type) {
    case "callout":
      content = <CalloutBlockView block={block} />;

      break;

    case "comparison_table":
      content = <ComparisonTableBlockView block={block} />;

      break;

    case "formula":
      content = <FormulaBlockView block={block} />;

      break;

    case "image":
      content = <ImageBlockView block={block} />;

      break;

    case "question_link":
      content = <QuestionLinkBlockView block={block} onQuestion={onQuestion} />;

      break;

    case "summary":
      content = <SummaryBlockView block={block} />;

      break;

    case "video":
      content = <VideoBlockView block={block} />;

      break;

    case "chart":
      content = <ChartBlock block={block} />;

      break;

    case "knowledge_map":
      content = <KnowledgeMapBlock block={block} graph={knowledgeGraph} />;

      break;

    case "parametric_scene":
      content = <ParametricSceneBlock block={block} />;

      break;

    default:
      break;
  }

  return <Suspense fallback={<ContentLoadingFallback />}>{content}</Suspense>;
}
