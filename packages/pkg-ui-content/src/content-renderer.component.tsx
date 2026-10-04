import { UIBox, UIChip, UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { UIBlockView } from "./block-view.component";
import { getVisibleContentBlocks } from "./get-visible-content-blocks.function";
import { UIMarkdownImage } from "./markdown-image.component";
import { UIMarkdownLink } from "./markdown-link.component";
import type { EditorialBlock, KnowledgeGraph } from "@guesant/saberes-application";

export interface UIContentRendererProps {
  markdown?: string;
  blocks?: EditorialBlock[];
  knowledgeGraph?: KnowledgeGraph;
  showRichContent?: boolean;
  onQuestion?(questionId: string | number): void;
}

export function UIContentRenderer(props: UIContentRendererProps) {
  const { markdown = "", blocks = [], knowledgeGraph, onQuestion, showRichContent = true } = props;

  const { t } = useTranslation();

  const visibleBlocks = getVisibleContentBlocks(blocks, showRichContent);

  const hasHiddenRichContent = visibleBlocks.length !== blocks.length;

  return (
    <UIContentGroup variant="tight">
      <UIBox>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeSanitize]}
          components={{ a: UIMarkdownLink, img: UIMarkdownImage }}
        >
          {markdown}
        </ReactMarkdown>
      </UIBox>

      {hasHiddenRichContent ? (
        <UIChip label={t("content.richContentDisabled")} size="small" />
      ) : null}

      {visibleBlocks.map((block) => {
        return (
          <UIBlockView
            key={`${block.type}-${JSON.stringify(block)}`}
            block={block}
            knowledgeGraph={knowledgeGraph}
            onQuestion={onQuestion}
          />
        );
      })}

      <UIChip size="small" label={t("content.reviewed")} variant="outlined" />
    </UIContentGroup>
  );
}
