import { Box, Chip, Stack } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { BlockView } from "./block-view.component";
import { MarkdownImage } from "./markdown-image.component";
import { MarkdownLink } from "./markdown-link.component";
import type { EditorialBlock, KnowledgeGraph } from "@guesant/saberes-application";

export type ContentRendererProps = {
  markdown?: string;
  blocks?: EditorialBlock[];
  knowledgeGraph?: KnowledgeGraph;
  onQuestion?: (questionId: string | number) => void;
};

export function ContentRenderer(props: ContentRendererProps) {
  const { markdown = "", blocks = [], knowledgeGraph, onQuestion } = props;

  const { t } = useTranslation();

  return (
    <Stack className="content-renderer" spacing={1}>
      <Box className="content-renderer__markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeSanitize]}
          components={{ a: MarkdownLink, img: MarkdownImage }}
        >
          {markdown}
        </ReactMarkdown>
      </Box>

      {blocks.map((block) => (
        <BlockView
          key={`${block.type}-${JSON.stringify(block)}`}
          block={block}
          knowledgeGraph={knowledgeGraph}
          onQuestion={onQuestion}
        />
      ))}

      <Chip size="small" label={t("content.reviewed")} variant="outlined" />
    </Stack>
  );
}
