import type { UiRowLayout } from "./ui-row-layout.interface";
import type { UIRowProps } from "./ui-row-props.interface";

const alignments = { center: "center", end: "flex-end", start: "flex-start", stretch: "stretch" } as const;

const layoutNames = { false: "row", true: "cluster" } as const;

const defaultRowProps = { align: "center", gap: "md", inset: "none", wrap: false } as const;

export function createUiRowLayout(props: UIRowProps): UiRowLayout {
  const { align, children, gap, inset, wrap } = { ...defaultRowProps, ...props };

  return {
    align,
    alignItems: alignments[align],
    children,
    gap,
    inset,
    layout: layoutNames[String(wrap) as "false" | "true"],
    wrap,
  };
}
