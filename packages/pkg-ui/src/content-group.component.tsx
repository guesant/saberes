import { UIBox } from "./box.component";
import type { UiSpacingToken } from "./layout/ui-spacing-token.type";
import type { ReactElement, ReactNode } from "react";

export type UIContentGroupProps = {
  children: ReactNode;
  id?: string;
  variant?: "tight" | "content" | "section" | "list" | "inline";
};

const groupGap = {
  content: "md",
  inline: "sm",
  list: "sm",
  section: "section",
  tight: "xs",
} satisfies Record<NonNullable<UIContentGroupProps["variant"]>, UiSpacingToken>;

export function UIContentGroup(props: UIContentGroupProps): ReactElement {
  const variant = props.variant || "content";

  const inline = variant === "inline";

  return (
    <UIBox
      align={inline ? "center" : "stretch"}
      gap={groupGap[variant]}
      id={props.id}
      inset="none"
      layout={inline ? "row" : "column"}
      sx={{ "& > *": { maxWidth: "100%", minWidth: 0 }, maxWidth: "100%" }}
      wrap={inline}
    >
      {props.children}
    </UIBox>
  );
}
