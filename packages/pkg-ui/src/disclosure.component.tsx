import { useState, type ReactElement, type ReactNode } from "react";
import { UIBox } from "./box.component";

export interface UIDisclosureProps {
  children: ReactNode;
  summary: ReactNode;
}

const disclosureSx = {
  "& > summary": {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    fontWeight: 600,
    minHeight: 44,
    paddingBlock: 1,
  },
  "& > summary::before": {
    content: '"›"',
    display: "inline-block",
    fontSize: "1.25rem",
    lineHeight: 1,
    marginInlineEnd: 1,
    transition: "transform 150ms ease",
  },
  "&[open] > summary::before": { transform: "rotate(90deg)" },
  "&[open] > summary": { marginBottom: 1 },
};

export function UIDisclosure(props: UIDisclosureProps): ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <UIBox
      component="details"
      gap="sm"
      inset="none"
      layout="column"
      open={open}
      onToggle={(event) => {
        return setOpen(event.currentTarget.open);
      }}
      sx={disclosureSx}
    >
      <UIBox component="summary" gap="sm" inset="none" layout="row" sx={{ minHeight: 44, cursor: "pointer", fontWeight: 600 }}>
        {props.summary}
      </UIBox>
      {props.children}
    </UIBox>
  );
}
