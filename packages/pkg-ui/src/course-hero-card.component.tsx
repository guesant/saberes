import { Card as MuiCard } from "@mui/material";
import type { CardProps as MuiCardProps } from "@mui/material";
import type { ReactElement } from "react";

export type UICourseHeroCardProps = MuiCardProps;

export function UICourseHeroCard(props: UICourseHeroCardProps): ReactElement {
  return (
    <MuiCard
      {...props}
      data-ui-inset="md"
      data-ui-layout="stack"
      data-ui-outset="xl"
      sx={{ mb: 4, p: { md: 4, xs: 2 }, ...props.sx }}
    />
  );
}
