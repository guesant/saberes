import { Box as MuiBox, Typography as MuiTypography } from "@mui/material";
import { useState, type ReactElement, type ReactNode } from "react";

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
    <MuiBox
      component="details"
      open={open}
      onToggle={(event) => {
        return setOpen(event.currentTarget.open);
      }}
      sx={disclosureSx}
    >
      <MuiTypography component="summary" variant="body2">
        {props.summary}
      </MuiTypography>
      {props.children}
    </MuiBox>
  );
}
