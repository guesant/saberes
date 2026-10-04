import { UIContentSurface } from "@guesant/saberes-ui";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkMath from "remark-math";
import { UIFormulaCaption } from "./formula-caption.component";
import type { FormulaBlock } from "@guesant/saberes-application";

type UIFormulaBlockViewProps = {
  block: FormulaBlock;
};

export function UIFormulaBlockView(props: UIFormulaBlockViewProps) {
  const { block } = props;

  return (
    <UIContentSurface mode="scrolling">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeSanitize]}>
        {`$$${block.formula}$$`}
      </ReactMarkdown>

      <UIFormulaCaption caption={block.caption} />
    </UIContentSurface>
  );
}
