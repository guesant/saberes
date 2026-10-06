import { UIContentGroup, UIContentSurface } from "@guesant/saberes-ui";
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
      <UIContentGroup variant="tight">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeSanitize, rehypeKatex]}>
          {`$$${block.formula}$$`}
        </ReactMarkdown>

        <UIFormulaCaption caption={block.caption} />
      </UIContentGroup>
    </UIContentSurface>
  );
}
