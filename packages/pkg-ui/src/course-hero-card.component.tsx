import { Card as MuiCard } from "@mui/material";
import { UIBox } from "./box.component";
import type { CardProps as MuiCardProps } from "@mui/material";
import type { ReactElement } from "react";

export type UICourseHeroCardProps = Omit<MuiCardProps, "sx">;

export function UICourseHeroCard(props: UICourseHeroCardProps): ReactElement {
  return (
    <UIBox
      {...props}
      component={MuiCard}
      gap="md"
      inset="md"
      layout="column"
      sx={{ p: { md: 4, xs: 2 } }}
    />
  );
}
