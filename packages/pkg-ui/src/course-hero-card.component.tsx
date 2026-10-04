import { Card as MuiCard } from "@mui/material";
import type { CardProps as MuiCardProps } from "@mui/material";
import type { ReactElement } from "react";

export type UICourseHeroCardProps = MuiCardProps;

export function UICourseHeroCard(props: UICourseHeroCardProps): ReactElement {
  return <MuiCard {...props} sx={{ mb: 4, p: { md: 5, xs: 2 }, ...props.sx }} />;
}
