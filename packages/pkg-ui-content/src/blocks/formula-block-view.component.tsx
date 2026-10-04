import { UIPaper } from "@guesant/saberes-ui";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkMath from "remark-math";
import { UIFormulaCaption } from "./formula-caption.component";
import type { EditorialBlock } from "@guesant/saberes-application";

type UIFormulaBlockViewProps = {
  block: Extract<EditorialBlock, { type: "formula" }>;
};

export function UIFormulaBlockView(props: UIFormulaBlockViewProps) {
  const { block } = props;

  return (
    <UIPaper variant="outlined" sx={{ p: 2, my: 3, overflowX: "auto" }}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeSanitize]}>
        {`$$${block.formula}$$`}
      </ReactMarkdown>

      <UIFormulaCaption caption={block.caption} />
    </UIPaper>
  );
}
