import { UIBox } from "./box.component";
import { getContentSurfaceConfig } from "./get-content-surface-config.function";
import type { UIContentSurfaceProps } from "./content-surface-props.interface";
import type { ReactElement } from "react";

export function UIContentSurface(props: UIContentSurfaceProps): ReactElement {
  const config = getContentSurfaceConfig(props.mode);

  return (
    <UIBox
      aria-label={props.ariaLabel}
      gap="sm"
      inset="md"
      layout="column"
      sx={{
        bgcolor: config.backgroundColor,
        border: "1px solid var(--mui-palette-divider)",
        borderRadius: "0.25rem",
        overflowX: config.overflowX,
      }}
    >
      {props.children}
    </UIBox>
  );
}
