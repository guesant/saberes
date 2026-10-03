import { Paper } from "@guesant/saberes-ui";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkMath from "remark-math";
import { FormulaCaption } from "./formula-caption.component";
import type { EditorialBlock } from "@guesant/saberes-application";

type FormulaBlockViewProps = {
  block: Extract<EditorialBlock, { type: "formula" }>;
};

export function FormulaBlockView(props: FormulaBlockViewProps) {
  const { block } = props;

  return (
    <Paper variant="outlined" sx={{ p: 2, my: 3, overflowX: "auto" }}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeSanitize]}>
        {`$$${block.formula}$$`}
      </ReactMarkdown>

      <FormulaCaption caption={block.caption} />
    </Paper>
  );
}
