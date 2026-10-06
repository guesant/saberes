import { UIBox } from "@guesant/saberes-ui";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { UIMarkdownImage } from "./markdown-image.component";

export interface UIQuestionRichTextProps {
  text: string;
}

export function UIQuestionRichText(props: UIQuestionRichTextProps) {
  return (
    <UIBox layout="flow">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeSanitize, rehypeKatex]} components={{ img: UIMarkdownImage }}>
        {props.text}
      </ReactMarkdown>
    </UIBox>
  );
}
